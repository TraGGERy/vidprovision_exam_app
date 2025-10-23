import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { activateSubscriptionByAdmin, deactivateSubscriptionByAdmin } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { userId, isActive } = await request.json();

    if (!userId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'userId and isActive are required' },
        { status: 400 }
      );
    }

    const idNum = parseInt(String(userId), 10);

    if (isActive) {
      await activateSubscriptionByAdmin(idNum, 'admin_toggle');
    } else {
      await deactivateSubscriptionByAdmin(idNum);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to toggle subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}