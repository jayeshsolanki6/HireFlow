import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { applications, jobs, companies, users, analyses } from "../../db/schema/index.js";

export const createApplication = async (candidateId: string, jobId: string, resumeUrl: string) => {
    const result = await db
        .insert(applications)
        .values({ candidateId, jobId, resumeUrl })
        .returning();
    return result[0];
};

export const findApplication = async (candidateId: string, jobId: string) => {
    const result = await db
        .select()
        .from(applications)
        .where(and(
            eq(applications.candidateId, candidateId),
            eq(applications.jobId, jobId)
        ));
    return result[0];
};

export const findApplicationById = async (applicationId: string) => {
    const result = await db
        .select()
        .from(applications)
        .where(eq(applications.id, applicationId));
    return result[0];
};

export const findApplicationsByCandidateId = async (candidateId: string) => {
    return await db
        .select({
            id: applications.id,
            jobId: applications.jobId,
            jobTitle: jobs.title,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
            appliedAt: applications.appliedAt,
            status: applications.status,
        })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(applications.candidateId, candidateId));
};

export const findApplicationsByJobId = async (jobId: string) => {
    return await db
        .select({
            applicationId: applications.id,
            candidateId: applications.candidateId,
            candidateName: users.name, // CONFIRM: your users table column name
            resumeUrl: applications.resumeUrl,
            appliedAt: applications.appliedAt,
            status: applications.status,
            analysisStatus: analyses.status,
            analysisScore: analyses.score,
            analysisRecommendation: sql<string | null>`${analyses.analysis}->>'recommendation'`,
        })
        .from(applications)
        .innerJoin(users, eq(applications.candidateId, users.id))
        .leftJoin(analyses, eq(analyses.applicationId, applications.id))
        .where(eq(applications.jobId, jobId));
};

export const updateApplicationStatus = async (applicationId: string, status: string) => {
    const result = await db
        .update(applications)
        .set({ status: status as any, updatedAt: new Date() })
        .where(eq(applications.id, applicationId))
        .returning();
    return result[0];
};

export const getCompanyById = async (companyId: string) => {
    const result = await db
        .select()
        .from(companies)
        .where(eq(companies.id, companyId));
    return result[0];
};

export const findApplicationDetail = async (applicationId: string) => {
    const result = await db
        .select({
            applicationId: applications.id,
            jobId: applications.jobId,
            jobTitle: jobs.title,
            candidateId: applications.candidateId,
            candidateName: users.name,
            candidateEmail: users.email,
            candidateBio: users.bio,
            candidateProfileImageUrl: users.profileImageUrl,
            resumeUrl: applications.resumeUrl,
            status: applications.status,
            appliedAt: applications.appliedAt,
        })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .innerJoin(users, eq(applications.candidateId, users.id))
        .where(eq(applications.id, applicationId));
    return result[0];
};

export const countApplicationsByRecruiterId = async (recruiterId: string) => {
    const result = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(companies.recruiterId, recruiterId));
    return result[0]?.count ?? 0;
};

export const findRecentApplicationsByRecruiterId = async (recruiterId: string, limit = 5) => {
    return await db
        .select({
            applicationId: applications.id,
            candidateName: users.name,
            jobTitle: jobs.title,
            jobId: jobs.id,
            status: applications.status,
            appliedAt: applications.appliedAt,
        })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .innerJoin(users, eq(applications.candidateId, users.id))
        .where(eq(companies.recruiterId, recruiterId))
        .orderBy(desc(applications.appliedAt))
        .limit(limit);
};