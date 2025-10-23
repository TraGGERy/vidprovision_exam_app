import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { updateUserCore, setDailyTestCount } from '@/lib/db/queries';

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

    const updatedUser = await request.json();

    // Map incoming user fields to DB updates
    const userIdNum = parseInt(updatedUser.id, 10);
    const name = `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim();

    await updateUserCore(userIdNum, updatedUser.email, name);

    // Update daily attempts in usage summary
    if (updatedUser?.usage?.dailyAttempts !== undefined) {
      const count = Number(updatedUser.usage.dailyAttempts) || 0;
      await setDailyTestCount(userIdNum, count);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}