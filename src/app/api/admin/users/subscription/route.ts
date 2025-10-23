import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  subscription: {
    isActive: boolean;
    plan: string;
    startDate: string | null;
    endDate: string | null;
    paymentMethod: string | null;
    amount: number;
    currency: string;
  };
  usage: {
    dailyAttempts: number;
    lastAttemptDate: string;
    totalAttempts: number;
  };
  status: string;
}

interface UserData {
  users: User[];
}

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
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { userId, isActive } = await request.json();

    if (!userId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Read current data
    const dataPath = join(process.cwd(), 'data', 'users.json');
    const fileContent = readFileSync(dataPath, 'utf8');
    const data: UserData = JSON.parse(fileContent);

    // Find and update user
    const userIndex = data.users.findIndex((user: User) => user.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = data.users[userIndex];
    const currentDate = new Date().toISOString();

    // Update subscription status
    user.subscription.isActive = isActive;
    
    if (isActive) {
      // Activate subscription
      user.subscription.startDate = currentDate;
      user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
      user.subscription.plan = 'premium';
      user.subscription.paymentMethod = 'admin_activated';
      user.subscription.amount = 2;
      user.subscription.currency = 'USD';
    } else {
      // Deactivate subscription
      user.subscription.endDate = currentDate;
      user.subscription.plan = 'free';
      user.subscription.paymentMethod = null;
    }

    user.status = isActive ? 'active' : 'inactive';

    // Save updated data
    writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: `User subscription ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: user
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}