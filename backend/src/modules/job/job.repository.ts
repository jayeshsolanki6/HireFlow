import { and, eq, ilike, gte, or } from 'drizzle-orm';

import { db } from '../../db/index.js'
import { CreateJobInput } from './job.types.js';
import { companies, jobs } from '../../db/schema/index.js'
import { company } from '../company/company.service.js';


export const getFilteredJobs = async (
    filters : { 
        search?: string, 
        location?: string, 
        jobType?: 'full_time' | 'part_time' | 'internship', 
        minSalary?: number 
    }
) => {
    const result = await db
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
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(
            and(
                eq(jobs.jobStatus, 'open'),
                filters.search ? or(
                    ilike(jobs.title, `%${filters.search}%`),
                    ilike(jobs.description, `%${filters.search}%`),
                    ilike(jobs.requirements, `%${filters.search}%`)
                ) : undefined,
                filters.location ? ilike(jobs.location, `%${filters.location}%`) : undefined,
                filters.jobType ? eq(jobs.jobType, filters.jobType) : undefined,
                filters.minSalary ? gte(jobs.salaryMin, filters.minSalary) : undefined
            )
        );
    return result;
}

export const getJobById = async (jobId : string) => {
    const result = await db
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
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(
            and(
                eq(jobs.id, jobId),
                eq(jobs.jobStatus, 'open')
            )
        );
    
    return result[0];
}

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

export const deleteJob = async (companyId : string, jobId : string) => {
    await db
        .delete(jobs)
        .where(
            and(
                eq(jobs.id, jobId),
                eq(jobs.companyId, companyId)
            )
        );
}

export const getJobWithCompanyOwner = async (jobId: string) => {
    const result = await db
        .select({
            id: jobs.id,
            companyId: jobs.companyId,
            recruiterId: companies.recruiterId,
        })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(jobs.id, jobId));
    return result[0];
};