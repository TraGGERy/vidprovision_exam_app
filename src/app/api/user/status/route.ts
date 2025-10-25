import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createOrGetUser, canUserStartTest, incrementUserAttempts, getUserUsageSummary } from '@/lib/db/queries';

// Production-ready logging
const logger = {
  info: (message: string, data?: unknown) => {
    console.log(`[UserStatusAPI] ${new Date().toISOString()} INFO: ${message}`, data ? JSON.stringify(data) : '');
  },
  error: (message: string, error?: unknown) => {
    console.error(`[UserStatusAPI] ${new Date().toISOString()} ERROR: ${message}`, error);
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`[UserStatusAPI] ${new Date().toISOString()} WARN: ${message}`, data ? JSON.stringify(data) : '');
  }
};

// GET: Check user subscription status and usage limits (auto-provision user in DB)
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn('Unauthorized access attempt to user status endpoint');
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    logger.info(`Checking status for user: ${userId}`);

    // Get Clerk user profile to seed DB record
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? `${userId}@example.com`;
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || 'User';

    // Ensure the user exists in our database (create-or-get)
    const dbUser = await createOrGetUser(userId, email, name);

    // Check limits and usage from DB
    const limits = await canUserStartTest(dbUser.id);
    const usageSummary = await getUserUsageSummary(dbUser.id);

    const response = {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        subscriptionType: dbUser.subscriptionType,
      },
      limits: {
        canStartTest: limits.canStart,
        subscriptionType: limits.subscriptionType,
        dailyLimit: limits.subscriptionType === 'free' ? (typeof limits.remainingTests === 'number' && limits.remainingTests >= 0 ? limits.remainingTests + usageSummary.testsToday : -1) : -1,
        dailyAttempts: usageSummary.testsToday,
        remainingAttempts: limits.remainingTests,
        lastAttemptDate: usageSummary.lastAttemptDate,
        totalAttempts: usageSummary.totalAttempts,
      }
    };

    logger.info(`Status check successful for user: ${userId}`, {
      canStartTest: limits.canStart,
      subscriptionType: limits.subscriptionType,
      remainingAttempts: limits.remainingTests
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to check user status', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to check user status'
      },
      { status: 500 }
    );
  }
}

// POST: Handle test actions (start_test)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn('Unauthorized access attempt to user status endpoint');
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (!action) {
      logger.warn(`Missing action in request body from user: ${userId}`);
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    logger.info(`Processing action: ${action} for user: ${userId}`);

    // Get Clerk user and ensure DB user exists
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? `${userId}@example.com`;
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || 'User';
    const dbUser = await createOrGetUser(userId, email, name);

    if (action === 'start_test') {
      // Check if user can start a test
      const limits = await canUserStartTest(dbUser.id);

      if (!limits.canStart) {
        logger.warn(`User ${userId} attempted to start test but limit reached`);
        return NextResponse.json(
          { error: 'Test limit reached. Please upgrade your subscription or try again later.' },
          { status: 403 }
        );
      }

      // Increment user attempts
      try {
        const success = await incrementUserAttempts(dbUser.id);
        if (!success) {
          throw new Error('Failed to increment attempts');
        }
        logger.info(`Successfully incremented attempts for user: ${userId}`);

        const usageSummary = await getUserUsageSummary(dbUser.id);
        const updatedLimits = await canUserStartTest(dbUser.id);

        return NextResponse.json({
          success: true,
          message: 'Test started successfully',
          limits: {
            canStartTest: updatedLimits.canStart,
            subscriptionType: updatedLimits.subscriptionType,
            dailyAttempts: usageSummary.testsToday,
            remainingAttempts: updatedLimits.remainingTests,
          }
        });

      } catch (error) {
        logger.error(`Failed to increment attempts for user: ${userId}`, error);
        return NextResponse.json(
          { error: 'Failed to start test - Please try again' },
          { status: 500 }
        );
      }
    }

    logger.warn(`Unknown action requested: ${action} by user: ${userId}`);
    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    );

  } catch (error) {
    logger.error('Failed to process user action', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process request'
      },
      { status: 500 }
    );
  }
}