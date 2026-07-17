import { ApiError } from "../../utils/ApiError.js";
import { createJob, findCompanyIdByRecruiterId, getAllJobsByCompanyId, getJobById, updateJob, closeJob } from "./job.repository.js";
import { CreateJobInput } from "./job.types.js";

export const job = {
    createJob: async (jobData : CreateJobInput) => {
        const companyId = await findCompanyIdByRecruiterId(jobData.recruiterId);

        if(!companyId) {
            throw new ApiError(404, "Company not found.");
        }

        const result = await createJob({companyId, ...jobData});

        return result;
    },

    getAllJobs: async (recruiterId : string) => {
        const companyId = await findCompanyIdByRecruiterId(recruiterId);

        if(!companyId) {
            throw new ApiError(404, "Company not found.");
        }

        const result = await getAllJobsByCompanyId(companyId);

        return result;
    },

    getJob: async (jobId : string) => {
        const result = await getJobById(jobId);

        if(!result) {
            throw new ApiError(404, "Job not found.");
        }

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

    closeJob : async (jobId : string, recruiterId : string) => {
        const companyId = await findCompanyIdByRecruiterId(recruiterId);

        if(!companyId) {
            throw new ApiError(404, "Company not found.");
        }

        const result = await closeJob(companyId, jobId);
        return result;
    }
}