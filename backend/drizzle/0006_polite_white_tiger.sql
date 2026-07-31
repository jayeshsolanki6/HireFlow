ALTER TABLE "analyses" DROP CONSTRAINT "analyses_applicationId_unique";--> statement-breakpoint
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_applicationId_applications_id_fk";
--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "candidateId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "jobId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "requestedByCandidate" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "requestedByRecruiter" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_candidateId_users_id_fk" FOREIGN KEY ("candidateId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_jobId_jobs_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "analyses_candidateId_jobId_index" ON "analyses" USING btree ("candidateId","jobId");--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "applicationId";