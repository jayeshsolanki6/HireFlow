ALTER TABLE "jobs" ALTER COLUMN "jobStatus" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."job_status";--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('open', 'draft');--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "jobStatus" SET DATA TYPE "public"."job_status" USING "jobStatus"::"public"."job_status";