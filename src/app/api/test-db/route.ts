import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createOrGetUser, canUserStartTest, startTestSession, endTestSession } from '@/lib/db/queries';

// Test endpoint to verify database integration with Clerk
export async function GET() {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // For testing purposes, we'll use mock email and name
    // In a real app, you'd get this from Clerk user data
    const mockEmail = `${userId}@example.com`;
    const mockName = 'Test User';

    // Create or get user in our database
    const user = await createOrGetUser(userId, mockEmail, mockName);

    // Check if user can start a test
    const testLimitCheck = await canUserStartTest(user.id);

    return NextResponse.json({
      success: true,
      message: 'Database integration working correctly',
      data: {
        user: {
          id: user.id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          subscriptionType: user.subscriptionType,
          createdAt: user.createdAt,
        },
        testLimits: testLimitCheck,
        limits: {
          freeTestsPerDay: 3,
          maxTestDurationMinutes: 8,
        },
      },
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Test endpoint to simulate starting and ending a test session
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body; // 'start' or 'end'

    if (action === 'start') {
      // Create or get user first
      const user = await createOrGetUser(userId, `${userId}@example.com`, 'Test User');
      
      // Start a test session
      const session = await startTestSession(user.id);
      
      return NextResponse.json({
        success: true,
        message: 'Test session started',
        session: {
          id: session.id,
          startTime: session.startTime,
          userId: session.userId,
        },
      });
    } else if (action === 'end' && body.sessionId) {
      // End the test session
      const result = await endTestSession(body.sessionId);
      
      return NextResponse.json({
        success: true,
        message: 'Test session ended',
        result: {
          sessionId: result.session.id,
          durationMinutes: result.durationMinutes,
          withinLimit: result.withinLimit,
          maxDurationMinutes: 8,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "start" or "end" with sessionId for end action.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Test session error:', error);
    return NextResponse.json(
      { 
        error: 'Test session operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}