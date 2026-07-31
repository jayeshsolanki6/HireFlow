import { ApiError } from "../../utils/ApiError.js";
import { createJob, findCompanyIdByRecruiterId, getAllJobsByCompanyId, getJobById, updateJob, deleteJob, getFilteredJobs } from "./job.repository.js";
import { CreateJobInput } from "./job.types.js";

export const job = {
    
    getJobs: async (
        filters : {
            search?: string,
            location?: string, 
            jobType?: 'full_time' | 'part_time' | 'internship', 
            minSalary?: number 
        }
    ) => {
        const result = await getFilteredJobs(filters);
        return result;
    },
    
    getJob: async (jobId : string) => {
        const result = await getJobById(jobId);

        if(!result) {
            throw new ApiError(404, "Job not found.");
        }

        return result;
    },

    createJob: async (jobData : CreateJobInput) => {
        const companyId = await findCompanyIdByRecruiterId(jobData.recruiterId);

        if(!companyId) {
            throw new ApiError(404, "Company not found.");
        }

        const result = await createJob({companyId, ...jobData});

        return result;
    },


    getMyJobs: async (recruiterId : string) => {
        const companyId = await findCompanyIdByRecruiterId(recruiterId);

        if(!companyId) {
            throw new ApiError(404, "Company not found.");
        }

        const result = await getAllJobsByCompanyId(companyId);

        return result;
    },


    updateJob: async (jobId : string, jobData : CreateJobInput) => {
        const companyId = await findCompanyIdByRecruiterId(jobData.recruiterId);

        if(!companyId) {
            throw new ApiError(404, "Company not found.");
        }

        const result = await updateJob({companyId, jobId, ...jobData});

        return result;
    },

    deleteJob : async (jobId : string, recruiterId : string) => {
        const companyId = await findCompanyIdByRecruiterId(recruiterId);

        if(!companyId) {
            throw new ApiError(404, "Company not found.");
        }

        await deleteJob(companyId, jobId);
    }
}