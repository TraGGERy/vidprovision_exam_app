import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { clerkClient } from '@clerk/nextjs/server';
import type { ClerkClient, User as ClerkUser } from '@clerk/nextjs/server';
import { createOrGetUser } from '@/lib/db/queries';

function isPaginatedUsersList(list: unknown): list is { data: ClerkUser[] } {
  return (
    typeof list === 'object' &&
    list !== null &&
    'data' in list &&
    Array.isArray((list as { data: unknown }).data)
  );
}

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

    let client: ClerkClient;
    if (typeof clerkClient === 'function') {
      client = await (clerkClient as unknown as () => Promise<ClerkClient>)();
    } else {
      client = clerkClient as ClerkClient;
    }

    const usersListUnknown = (await client.users.getUserList({ limit: 100 })) as unknown;
    let clerkUsers: ClerkUser[] = [];
    if (Array.isArray(usersListUnknown)) {
      clerkUsers = usersListUnknown as ClerkUser[];
    } else if (isPaginatedUsersList(usersListUnknown)) {
      clerkUsers = usersListUnknown.data;
    }

    const created = 0;
    let existing = 0;
    const results: Array<{ id: string; email: string; created: boolean }> = [];

    for (const u of clerkUsers) {
      const email = u.emailAddresses?.[0]?.emailAddress || `${u.id}@example.com`;
      const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username || 'User';
      const dbUser = await createOrGetUser(u.id, email, name);

      existing += 1;
      results.push({ id: String(dbUser.id), email: dbUser.email, created: false });
    }

    return NextResponse.json({ success: true, created, existing, results });
  } catch (error) {
    console.error('Error backfilling users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}