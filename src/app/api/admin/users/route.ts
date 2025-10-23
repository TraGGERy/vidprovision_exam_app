import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface UserData {
  users: Array<{
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
  }>;
}

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
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Read users from JSON database
    const dataPath = join(process.cwd(), 'data', 'users.json');
    const fileContent = readFileSync(dataPath, 'utf8');
    const data: UserData = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      users: data.users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}