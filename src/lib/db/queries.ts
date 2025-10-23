import { db, users, userTests, testSessions } from './index';
import { eq, and, desc, sql } from 'drizzle-orm';
import type { User, NewUser, UserTest, NewUserTest, TestSession, NewTestSession } from './schema';

// Constants for free tier limitations
const FREE_DAILY_TEST_LIMIT = 3;
const MAX_TEST_DURATION_MINUTES = 8;

/**
 * Create or get user by Clerk ID
 */
export async function createOrGetUser(clerkId: string, email: string, name?: string): Promise<User> {
  // Try to find existing user
  const existingUser = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  
  if (existingUser.length > 0) {
    return existingUser[0];
  }
  
  // Create new user
  const newUser: NewUser = {
    clerkId,
    email,
    name,
    subscriptionType: 'free',
  };
  
  const [createdUser] = await db.insert(users).values(newUser).returning();
  return createdUser;
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Update user subscription type
 */
export async function updateUserSubscription(userId: number, subscriptionType: 'free' | 'premium'): Promise<User> {
  const [updatedUser] = await db
    .update(users)
    .set({ 
      subscriptionType,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId))
    .returning();
  
  return updatedUser;
}

/**
 * Check if user can start a new test (daily limit check)
 */
export async function canUserStartTest(userId: number): Promise<{
  canStart: boolean;
  testsToday: number;
  remainingTests: number;
  subscriptionType: string;
}> {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  
  if (user.length === 0) {
    throw new Error('User not found');
  }
  
  const userRecord = user[0];
  
  // Premium users have unlimited tests
  if (userRecord.subscriptionType === 'premium') {
    return {
      canStart: true,
      testsToday: 0,
      remainingTests: -1, // -1 indicates unlimited
      subscriptionType: 'premium'
    };
  }
  
  // Check today's test count for free users
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const todayTests = await db
    .select()
    .from(userTests)
    .where(and(
      eq(userTests.userId, userId),
      eq(userTests.testDate, today)
    ))
    .limit(1);
  
  const testsToday = todayTests.length > 0 ? todayTests[0].testCount : 0;
  const remainingTests = Math.max(0, FREE_DAILY_TEST_LIMIT - testsToday);
  
  return {
    canStart: testsToday < FREE_DAILY_TEST_LIMIT,
    testsToday,
    remainingTests,
    subscriptionType: 'free'
  };
}

/**
 * Start a new test session
 */
export async function startTestSession(userId: number): Promise<TestSession> {
  // Check if user can start a test
  const canStart = await canUserStartTest(userId);
  
  if (!canStart.canStart) {
    throw new Error(`Daily test limit reached. You have used ${canStart.testsToday} out of ${FREE_DAILY_TEST_LIMIT} free tests today.`);
  }
  
  // Create new test session
  const newSession: NewTestSession = {
    userId,
    startTime: new Date(),
    completed: false,
  };
  
  const [session] = await db.insert(testSessions).values(newSession).returning();
  return session;
}

/**
 * End a test session and update daily counts
 */
export async function endTestSession(sessionId: number): Promise<{
  session: TestSession;
  durationMinutes: number;
  withinLimit: boolean;
}> {
  // Get the session
  const sessionResult = await db.select().from(testSessions).where(eq(testSessions.id, sessionId)).limit(1);
  
  if (sessionResult.length === 0) {
    throw new Error('Test session not found');
  }
  
  const session = sessionResult[0];
  
  if (session.completed) {
    throw new Error('Test session already completed');
  }
  
  const endTime = new Date();
  const durationMs = endTime.getTime() - session.startTime.getTime();
  const durationMinutes = Math.round(durationMs / (1000 * 60));
  const withinLimit = durationMinutes <= MAX_TEST_DURATION_MINUTES;
  
  // Update the session
  const [updatedSession] = await db
    .update(testSessions)
    .set({
      endTime,
      durationMinutes,
      completed: true,
    })
    .where(eq(testSessions.id, sessionId))
    .returning();
  
  // Update daily test count
  await updateDailyTestCount(session.userId, durationMinutes);
  
  return {
    session: updatedSession,
    durationMinutes,
    withinLimit
  };
}

/**
 * Update daily test count and duration
 */
export async function updateDailyTestCount(userId: number, durationMinutes: number): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if record exists for today
  const existingRecord = await db
    .select()
    .from(userTests)
    .where(and(
      eq(userTests.userId, userId),
      eq(userTests.testDate, today)
    ))
    .limit(1);
  
  if (existingRecord.length > 0) {
    // Update existing record
    await db
      .update(userTests)
      .set({
        testCount: sql`${userTests.testCount} + 1`,
        totalDurationMinutes: sql`${userTests.totalDurationMinutes} + ${durationMinutes}`,
      })
      .where(eq(userTests.id, existingRecord[0].id));
  } else {
    // Create new record
    const newRecord: NewUserTest = {
      userId,
      testDate: today,
      testCount: 1,
      totalDurationMinutes: durationMinutes,
    };
    
    await db.insert(userTests).values(newRecord);
  }
}

/**
 * Get user's test history
 */
export async function getUserTestHistory(userId: number, limit: number = 30): Promise<UserTest[]> {
  return await db
    .select()
    .from(userTests)
    .where(eq(userTests.userId, userId))
    .orderBy(desc(userTests.testDate))
    .limit(limit);
}

/**
 * Get user's recent test sessions
 */
export async function getUserTestSessions(userId: number, limit: number = 10): Promise<TestSession[]> {
  return await db
    .select()
    .from(testSessions)
    .where(eq(testSessions.userId, userId))
    .orderBy(desc(testSessions.startTime))
    .limit(limit);
}

/**
 * Get active (incomplete) test sessions for a user
 */
export async function getActiveTestSessions(userId: number): Promise<TestSession[]> {
  return await db
    .select()
    .from(testSessions)
    .where(and(
      eq(testSessions.userId, userId),
      eq(testSessions.completed, false)
    ))
    .orderBy(desc(testSessions.startTime));
}

/**
 * Force end all active sessions (cleanup function)
 */
export async function forceEndActiveSessions(userId: number): Promise<void> {
  const activeSessions = await getActiveTestSessions(userId);
  
  for (const session of activeSessions) {
    await endTestSession(session.id);
  }
}

export async function incrementUserAttempts(userId: number): Promise<boolean> {
  const limits = await canUserStartTest(userId);
  if (!limits.canStart) return false;
  await updateDailyTestCount(userId, 0);
  return true;
}

export async function activateSubscriptionByAdmin(userId: number, paymentMethod: string = 'admin'): Promise<User> {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 30);
  const [updated] = await db
    .update(users)
    .set({
      subscriptionType: 'premium',
      subscriptionActive: true,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      paymentMethod,
      amount: '2.00',
      currency: 'USD',
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();
  return updated;
}

export async function getUserUsageSummary(userId: number): Promise<{ testsToday: number; remainingTests: number; lastAttemptDate: string | null; totalAttempts: number; }> {
  const today = new Date().toISOString().split('T')[0];
  const todayRow = await db.select().from(userTests).where(and(eq(userTests.userId, userId), eq(userTests.testDate, today))).limit(1);
  const testsToday = todayRow.length > 0 ? todayRow[0].testCount : 0;
  const remainingTests = Math.max(0, FREE_DAILY_TEST_LIMIT - testsToday);
  const latestRow = await db.select().from(userTests).where(eq(userTests.userId, userId)).orderBy(desc(userTests.testDate)).limit(1);
  const lastAttemptDate = latestRow.length > 0 ? latestRow[0].testDate : null;
  const totalAgg = await db.select({ sum: sql<number>`COALESCE(SUM(${userTests.testCount}), 0)` }).from(userTests).where(eq(userTests.userId, userId));
  const totalAttempts = totalAgg[0]?.sum ?? 0;
  return { testsToday, remainingTests, lastAttemptDate, totalAttempts };
}