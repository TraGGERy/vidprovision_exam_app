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

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Read current data
    const dataPath = join(process.cwd(), 'data', 'users.json');
    const fileContent = readFileSync(dataPath, 'utf8');
    const data: UserData = JSON.parse(fileContent);

    // Find and update user by email
    const userIndex = data.users.findIndex((user: User) => user.email === email);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found. Ask user to sign in first.' },
        { status: 404 }
      );
    }

    const user = data.users[userIndex];
    const currentDate = new Date().toISOString();

    // Grant lifetime subscription
    user.subscription.isActive = true;
    user.subscription.plan = 'lifetime';
    user.subscription.startDate = currentDate;
    user.subscription.endDate = null; // No expiry
    user.subscription.paymentMethod = 'admin_lifetime';
    user.subscription.amount = 0;
    user.subscription.currency = 'USD';

    user.status = 'active';

    // Save updated data
    writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Lifetime access granted successfully',
      user: user,
    });

  } catch (error) {
    console.error('Error granting lifetime access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}