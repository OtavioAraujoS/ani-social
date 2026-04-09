DO $$ BEGIN
    CREATE TYPE "public"."user_rank" AS ENUM('S', 'A', 'B', 'C', 'D');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "rank" "user_rank" DEFAULT 'D' NOT NULL;