ALTER TABLE "analyses" DROP CONSTRAINT "analyses_candidateId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_jobId_jobs_id_fk";
--> statement-breakpoint
DROP INDEX "analyses_candidateId_jobId_index";--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "applicationId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_applicationId_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "candidateId";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "jobId";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "requestedByCandidate";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "requestedByRecruiter";--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_applicationId_unique" UNIQUE("applicationId");