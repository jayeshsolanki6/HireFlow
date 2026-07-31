ALTER TABLE "analyses" ADD COLUMN "candidateId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "jobId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "status" "analysis_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "score" integer;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "analysis" jsonb;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "requestedByCandidate" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "requestedByRecruiter" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_candidateId_users_id_fk" FOREIGN KEY ("candidateId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_jobId_jobs_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "analyses_candidateId_jobId_index" ON "analyses" USING btree ("candidateId","jobId");