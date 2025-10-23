import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { userService } from '@/lib/userService';

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

// Helper function to check if subscription is expired
const isSubscriptionExpired = (endDate: Date | string | null): boolean => {
  if (!endDate) return false;
  const d = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return d < new Date();
};

// GET: Check user subscription status and usage limits
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

    // Find user in JSON file
    const user = userService.getUserById(userId);

    if (!user) {
      logger.warn(`User not found in JSON file: ${userId}`);
      return NextResponse.json(
        { error: 'User not found - Please contact support' },
        { status: 404 }
      );
    }

    // Check if subscription is expired and auto-deactivate
    const updatedUser = { ...user };
    if (user.subscription.isActive && isSubscriptionExpired(user.subscription.endDate)) {
      logger.info(`Auto-deactivating expired subscription for user: ${userId}`);
      // Note: You would need to implement updateUserSubscription in userService
      // For now, we'll just mark it in the response
      updatedUser.subscription.isActive = false;
    }

    // Check if user can start a test
    const canStartResult = userService.canUserStartTest(userId);
    const canStart = canStartResult.canStart;

    // Determine subscription type
    const subscriptionType = updatedUser.subscription.isActive ? updatedUser.subscription.plan : 'free';

    // Calculate remaining attempts for free users
    const today = new Date().toISOString().split('T')[0];
    const isToday = updatedUser.usage.lastAttemptDate === today;
    const dailyAttempts = isToday ? updatedUser.usage.dailyAttempts : 0;
    const remainingAttempts = subscriptionType === 'free' ? Math.max(0, 3 - dailyAttempts) : -1; // -1 means unlimited

    const response = {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        subscription: updatedUser.subscription,
        usage: updatedUser.usage,
        status: updatedUser.status
      },
      limits: {
        canStartTest: canStart,
        subscriptionType,
        dailyLimit: subscriptionType === 'free' ? 3 : -1, // -1 means unlimited
        dailyAttempts,
        remainingAttempts,
        lastAttemptDate: updatedUser.usage.lastAttemptDate,
        totalAttempts: updatedUser.usage.totalAttempts
      }
    };

    logger.info(`Status check successful for user: ${userId}`, { 
      canStartTest: canStart, 
      subscriptionType, 
      remainingAttempts 
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

// POST: Handle test actions (start_test, etc.)
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

    if (action === 'start_test') {
      // Check if user can start a test
      const canStartResult = userService.canUserStartTest(userId);
      const canStart = canStartResult.canStart;

      if (!canStart) {
        logger.warn(`User ${userId} attempted to start test but limit reached`);
        return NextResponse.json(
          { error: 'Daily test limit reached. Please upgrade your subscription or try again tomorrow.' },
          { status: 403 }
        );
      }

      // Increment user attempts
      try {
        const success = userService.incrementUserAttempts(userId);
        if (!success) {
          throw new Error('Failed to increment attempts');
        }
        logger.info(`Successfully incremented attempts for user: ${userId}`);

        return NextResponse.json({
          success: true,
          message: 'Test started successfully'
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