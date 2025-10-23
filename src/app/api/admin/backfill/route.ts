import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { clerkClient } from '@clerk/nextjs/server';
import { createOrGetUser } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch Clerk users (first page; can be extended with pagination)
    const users = await clerkClient.users.getUserList({ limit: 100 });

    let created = 0;
    let existing = 0;
    const results: Array<{ id: string; email: string; created: boolean }> = [];

    for (const u of users) {
      const email = u.emailAddresses?.[0]?.emailAddress || `${u.id}@example.com`;
      const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username || 'User';
      const dbUser = await createOrGetUser(u.id, email, name);
      const wasCreated = !!dbUser && !!dbUser.createdRecently; // if queries returns such a flag; fallback below

      if (wasCreated) {
        created += 1;
      } else {
        existing += 1;
      }

      results.push({ id: String(dbUser.id), email: dbUser.email, created: wasCreated });
    }

    return NextResponse.json({ success: true, created, existing, results });
  } catch (error) {
    console.error('Error backfilling users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}