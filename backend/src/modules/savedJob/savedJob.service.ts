import { ApiError } from "../../utils/ApiError.js";
import { addToSavedJobs, checkSavedJobExists, getJobById, getSavedJobsByUserId, removeSavedJob } from "./savedJob.repository.js";

export const savedJob = {
    saveJob : async (userId : string, jobId : string) => {
        const job = await getJobById(jobId);

        if(!job) {
            throw new ApiError(404, "Job not found");
        }

        await addToSavedJobs(userId, jobId);
    },

    getSavedJobs : async (userId : string) => {
        const result = await getSavedJobsByUserId(userId);
        return result;
    },

    removeSavedJob : async (userId : string, jobId : string) => {
        const checkSavedJob = await checkSavedJobExists(userId, jobId);

        if(!checkSavedJob) {
            throw new ApiError(404, "Saved job not found");
        }

        await removeSavedJob(userId, jobId);
    }
}

