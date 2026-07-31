ALTER TABLE "analyses" DROP CONSTRAINT "analyses_candidateId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_jobId_jobs_id_fk";
--> statement-breakpoint
DROP INDEX "analyses_candidateId_jobId_index";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "candidateId";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "jobId";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "score";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "analysis";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "requestedByCandidate";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "requestedByRecruiter";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "updatedAt";