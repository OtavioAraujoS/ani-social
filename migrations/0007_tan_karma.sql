DELETE FROM "comments" WHERE "topic_id" NOT IN (SELECT "id" FROM "topics");--> statement-breakpoint
DELETE FROM "comments" WHERE "created_by_user_id" NOT IN (SELECT "id" FROM "users");--> statement-breakpoint
DELETE FROM "topics" WHERE "anime_id" NOT IN (SELECT "id" FROM "animes");--> statement-breakpoint
DELETE FROM "topics" WHERE "created_by_user_id" NOT IN (SELECT "id" FROM "users");--> statement-breakpoint
DELETE FROM "topics" WHERE "updated_by_user_id" IS NOT NULL AND "updated_by_user_id" NOT IN (SELECT "id" FROM "users");--> statement-breakpoint
DELETE FROM "animes" WHERE "created_by_user_id" NOT IN (SELECT "id" FROM "users");--> statement-breakpoint
DELETE FROM "animes" WHERE "updated_by_user_id" IS NOT NULL AND "updated_by_user_id" NOT IN (SELECT "id" FROM "users");--> statement-breakpoint
ALTER TABLE "animes" ADD CONSTRAINT "animes_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animes" ADD CONSTRAINT "animes_updated_by_user_id_users_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_anime_id_animes_id_fk" FOREIGN KEY ("anime_id") REFERENCES "public"."animes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_updated_by_user_id_users_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;