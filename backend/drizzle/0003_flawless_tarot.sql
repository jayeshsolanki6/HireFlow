ALTER TABLE "jobs" DROP CONSTRAINT "jobs_recruiterId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "recruiterId";