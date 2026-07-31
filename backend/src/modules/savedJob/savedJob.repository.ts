import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js"
import { companies, jobs, savedJobs } from "../../db/schema/index.js";


export const getJobById = async (jobId : string) => {
    const result = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, jobId));

    return result[0];
}

export const addToSavedJobs = async (userId : string, jobId : string) => {
    await db
        .insert(savedJobs)
        .values({
            userId,
            jobId
        });
}

export const getSavedJobsByUserId = async (userId: string) => {
    return await db
        .select({
            jobId: jobs.id,
            companyId: companies.id,
            companyName: companies.name,
            companyLogoUrl: companies.logoUrl,
            companyWebsite: companies.website,
            title: jobs.title,
            description: jobs.description,
            requirements: jobs.requirements,
            salaryMin: jobs.salaryMin,
            salaryMax: jobs.salaryMax,
            location: jobs.location,
            jobType: jobs.jobType,
            jobStatus: jobs.jobStatus,
            deadline: jobs.deadline,
            createdAt: jobs.createdAt
        })
        .from(savedJobs)
        .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(savedJobs.userId, userId));
};

export const checkSavedJobExists = async (userId : string, jobId : string) => {
    const result = await db
        .select()
        .from(savedJobs)
        .where(and(
            eq(savedJobs.userId, userId),
            eq(savedJobs.jobId, jobId)
        ));

    return result.length > 0;
};

export const removeSavedJob = async (userId : string, jobId : string) => {
    await db
        .delete(savedJobs)
        .where(and(
            eq(savedJobs.userId, userId),
            eq(savedJobs.jobId, jobId)
        ));
}