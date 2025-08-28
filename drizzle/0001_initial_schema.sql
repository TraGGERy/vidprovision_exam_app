-- Initial schema migration for user subscription management
-- Created: 2024-01-21

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"subscription_type" text DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Create user_tests table
CREATE TABLE IF NOT EXISTS "user_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"test_date" date NOT NULL,
	"test_count" integer DEFAULT 0 NOT NULL,
	"total_duration_minutes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create test_sessions table
CREATE TABLE IF NOT EXISTS "test_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"duration_minutes" integer DEFAULT 0,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "user_tests" ADD CONSTRAINT "user_tests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "test_sessions" ADD CONSTRAINT "test_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS "clerk_id_idx" ON "users" ("clerk_id");
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "user_date_idx" ON "user_tests" ("user_id","test_date");
CREATE INDEX IF NOT EXISTS "test_date_idx" ON "user_tests" ("test_date");
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "test_sessions" ("user_id");
CREATE INDEX IF NOT EXISTS "start_time_idx" ON "test_sessions" ("start_time");
CREATE INDEX IF NOT EXISTS "completed_idx" ON "test_sessions" ("completed");

-- Add unique constraint for user_tests to prevent duplicate daily records
CREATE UNIQUE INDEX IF NOT EXISTS "user_tests_user_date_unique" ON "user_tests" ("user_id", "test_date");