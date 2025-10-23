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

    const { id, email, firstName, lastName, dailyAttempts } = await request.json();

    // Validate required fields
    if (!id || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate daily attempts
    if (dailyAttempts !== undefined && (dailyAttempts < 0 || dailyAttempts > 3)) {
      return NextResponse.json(
        { error: 'Daily attempts must be between 0 and 3' },
        { status: 400 }
      );
    }

    // Read current data
    const dataPath = join(process.cwd(), 'data', 'users.json');
    const fileContent = readFileSync(dataPath, 'utf8');
    const data: UserData = JSON.parse(fileContent);

    // Find user
    const userIndex = data.users.findIndex((user: User) => user.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check for duplicate email (excluding current user)
    const duplicateEmail = data.users.find((user: User) => user.email === email && user.id !== id);
    if (duplicateEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Update user
    const user = data.users[userIndex];
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    
    if (dailyAttempts !== undefined) {
      user.usage.dailyAttempts = dailyAttempts;
    }

    // Save updated data
    writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: user
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}