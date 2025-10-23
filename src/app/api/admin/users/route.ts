import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAllUsers, getUserUsageSummary } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
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

    // Fetch users from PostgreSQL and map to admin UI shape
    const dbUsers = await getAllUsers();
    const users = await Promise.all(
      dbUsers.map(async (u) => {
        const nameParts = (u.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        const usage = await getUserUsageSummary(u.id);
        return {
          id: String(u.id),
          email: u.email,
          firstName,
          lastName,
          createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
          subscription: {
            isActive: !!u.subscriptionActive,
            plan: u.subscriptionType || 'free',
            startDate: u.subscriptionStartDate ? new Date(u.subscriptionStartDate).toISOString() : null,
            endDate: u.subscriptionEndDate ? new Date(u.subscriptionEndDate).toISOString() : null,
            paymentMethod: u.paymentMethod ?? null,
            amount: u.amount ? Number(u.amount as unknown as string) : 0,
            currency: u.currency ?? 'USD',
          },
          usage: {
            dailyAttempts: usage.testsToday,
            lastAttemptDate: usage.lastAttemptDate ?? '',
            totalAttempts: usage.totalAttempts,
          },
          status: u.subscriptionActive ? 'active' : 'inactive',
        };
      })
    );

    return NextResponse.json({
      success: true,
      users,
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}