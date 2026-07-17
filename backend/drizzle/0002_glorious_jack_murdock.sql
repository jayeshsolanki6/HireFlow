DROP TABLE "skills" CASCADE;--> statement-breakpoint
DROP TABLE "user_skills" CASCADE;--> statement-breakpoint
DROP TABLE "job_skills" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profileImageUrl" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "resumeUrl" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;