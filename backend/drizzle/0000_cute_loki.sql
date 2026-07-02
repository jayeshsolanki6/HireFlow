CREATE TYPE "public"."role" AS ENUM('candidate', 'recruiter', 'admin');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('open', 'closed', 'draft');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('full_time', 'part_time', 'internship');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('applied', 'shortlisted', 'rejected', 'hired');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recruiterId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"logoUrl" text,
	"about" text,
	"website" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_recruiterId_unique" UNIQUE("recruiterId")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recruiterId" uuid NOT NULL,
	"companyId" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"requirements" text NOT NULL,
	"salaryMin" integer,
	"salaryMax" integer,
	"location" varchar(255) NOT NULL,
	"jobType" "job_type" NOT NULL,
	"jobStatus" "job_status" NOT NULL,
	"deadline" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jobId" uuid NOT NULL,
	"candidateId" uuid NOT NULL,
	"resumeUrl" text NOT NULL,
	"status" "application_status" DEFAULT 'applied' NOT NULL,
	"appliedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skills_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_skills" (
	"userId" uuid NOT NULL,
	"skillId" uuid NOT NULL,
	CONSTRAINT "user_skills_userId_skillId_pk" PRIMARY KEY("userId","skillId")
);
--> statement-breakpoint
CREATE TABLE "job_skills" (
	"jobId" uuid NOT NULL,
	"skillId" uuid NOT NULL,
	CONSTRAINT "job_skills_jobId_skillId_pk" PRIMARY KEY("jobId","skillId")
);
--> statement-breakpoint
CREATE TABLE "saved_jobs" (
	"userId" uuid NOT NULL,
	"jobId" uuid NOT NULL,
	"savedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "saved_jobs_userId_jobId_pk" PRIMARY KEY("userId","jobId")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"hashedToken" varchar(255) NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_hashedToken_unique" UNIQUE("hashedToken")
);
--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_recruiterId_users_id_fk" FOREIGN KEY ("recruiterId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_recruiterId_users_id_fk" FOREIGN KEY ("recruiterId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_jobs_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidateId_users_id_fk" FOREIGN KEY ("candidateId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skillId_skills_id_fk" FOREIGN KEY ("skillId") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_skills" ADD CONSTRAINT "job_skills_jobId_jobs_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_skills" ADD CONSTRAINT "job_skills_skillId_skills_id_fk" FOREIGN KEY ("skillId") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_jobId_jobs_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "applications_jobId_candidateId_index" ON "applications" USING btree ("jobId","candidateId");