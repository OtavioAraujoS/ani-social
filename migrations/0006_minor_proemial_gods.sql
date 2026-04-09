CREATE TYPE "public"."user_rank" AS ENUM('S', 'A', 'B', 'C', 'D');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "rank" "user_rank" DEFAULT 'D' NOT NULL;