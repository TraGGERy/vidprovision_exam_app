import { pgTable, serial, text, timestamp, integer, boolean, date, index, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table - stores user information and subscription status
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(), // Integration with Clerk auth
  email: text('email').notNull().unique(),
  name: text('name'),
  subscriptionType: text('subscription_type').notNull().default('free'), // 'free' or 'premium'
  // Added fields to mirror JSON subscription details
  subscriptionActive: boolean('subscription_active').notNull().default(false),
  subscriptionStartDate: timestamp('subscription_start_date'),
  subscriptionEndDate: timestamp('subscription_end_date'),
  paymentMethod: text('payment_method'),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  currency: text('currency').default('USD'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    clerkIdIdx: index('clerk_id_idx').on(table.clerkId),
    emailIdx: index('email_idx').on(table.email),
  };
});

// User tests table - tracks daily test counts and total duration
export const userTests = pgTable('user_tests', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  testDate: date('test_date').notNull(), // Date of the tests (YYYY-MM-DD)
  testCount: integer('test_count').notNull().default(0), // Number of tests performed on this date
  totalDurationMinutes: integer('total_duration_minutes').notNull().default(0), // Total duration in minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userDateIdx: index('user_date_idx').on(table.userId, table.testDate),
    testDateIdx: index('test_date_idx').on(table.testDate),
  };
});

// Test sessions table - individual test session records
export const testSessions = pgTable('test_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  durationMinutes: integer('duration_minutes').default(0), // Calculated duration
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('user_id_idx').on(table.userId),
    startTimeIdx: index('start_time_idx').on(table.startTime),
    completedIdx: index('completed_idx').on(table.completed),
  };
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userTests: many(userTests),
  testSessions: many(testSessions),
}));

export const userTestsRelations = relations(userTests, ({ one }) => ({
  user: one(users, {
    fields: [userTests.userId],
    references: [users.id],
  }),
}));

export const testSessionsRelations = relations(testSessions, ({ one }) => ({
  user: one(users, {
    fields: [testSessions.userId],
    references: [users.id],
  }),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserTest = typeof userTests.$inferSelect;
export type NewUserTest = typeof userTests.$inferInsert;
export type TestSession = typeof testSessions.$inferSelect;
export type NewTestSession = typeof testSessions.$inferInsert;