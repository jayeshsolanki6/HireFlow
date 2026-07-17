import { and, eq } from 'drizzle-orm';

import { db } from '../../db/index.js'
import { CreateJobInput } from './job.types.js';
import { companies, jobs } from '../../db/schema/index.js'

export const findCompanyIdByRecruiterId = async (recruiterId : string) => {
    const result = await db
        .select({ companyId: companies.id })
        .from(companies)
        .where(eq(companies.recruiterId, recruiterId))

    return result[0]?.companyId;
}

export const createJob = async (jobData : CreateJobInput & { companyId: string }) => {
    const result = await db
        .insert(jobs)
        .values({
            companyId: jobData.companyId,
            title: jobData.title,
            description: jobData.description,
            requirements: jobData.requirements,
            salaryMin: jobData.salaryMin ?? null,
            salaryMax: jobData.salaryMax ?? null,
            location: jobData.location,
            jobType: jobData.jobType,
            jobStatus: jobData.jobStatus,
            deadline: jobData.deadline ?? null
        })
        .returning();
    
    return result[0];
}

export const getAllJobsByCompanyId = async (companyId : string) => {
    const result = await db
        .select()
        .from(jobs)
        .where(eq(jobs.companyId, companyId));

    return result;
}

export const getJobById = async (jobId : string) => {
    const result = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, jobId));
    
    return result[0];
}

export const updateJob = async (jobData : CreateJobInput & { companyId: string, jobId: string }) => {
    const result = await db
        .update(jobs)
        .set({
            title: jobData.title,
            description: jobData.description,
            requirements: jobData.requirements,
            salaryMin: jobData.salaryMin ?? null,
            salaryMax: jobData.salaryMax ?? null,
            location: jobData.location,
            jobType: jobData.jobType,
            jobStatus: jobData.jobStatus,
            deadline: jobData.deadline ?? null,
            updatedAt: new Date()
        })
        .where(
            and(
                eq(jobs.id, jobData.jobId),
                eq(jobs.companyId, jobData.companyId)
            )
        )
        .returning();

    return result[0];
}

export const closeJob = async (companyId : string, jobId : string) => {
    const result = await db
        .update(jobs)
        .set({
            jobStatus: "closed",
            updatedAt: new Date()
        })
        .where(
            and(
                eq(jobs.id, jobId),
                eq(jobs.companyId, companyId)
            )
        )
        .returning();

    return result[0];
}
