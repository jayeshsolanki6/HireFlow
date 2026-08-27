import { ApiError } from "../../utils/ApiError.js";
import { getJobById, getJobWithCompanyOwner } from "../job/job.repository.js";
import { findApplicationById, findApplicationsByJobId } from "../application/application.repository.js";
import { findAnalysisByApplicationId, upsertPendingAnalysis } from "./analysis.repository.js";
import { enqueueAnalysisJob } from "../../queue/analysis.queue.js";

export const analysis = {

    analyzeAllForJob: async (recruiterId: string, jobId: string) => {
        const jobOwner = await getJobWithCompanyOwner(jobId);
        if (!jobOwner) throw new ApiError(404, "Job not found");
        if (jobOwner.recruiterId !== recruiterId) {
            throw new ApiError(403, "You are not allowed to analyze applicants for this job");
        }

        const applicants = await findApplicationsByJobId(jobId);

        let queuedCount = 0;
        for (const applicant of applicants) {
            // only skip if currently mid-analysis — everything else (including completed) gets re-queued
            if (applicant.analysisStatus === "processing" || applicant.analysisStatus === "pending") {
                continue;
            }
            await upsertPendingAnalysis(applicant.applicationId);
            await enqueueAnalysisJob(applicant.applicationId);
            queuedCount++;
        }

        return { queuedCount, totalApplicants: applicants.length };
    },

    analyseSingle: async (recruiterId: string, applicationId: string) => {
        const application = await findApplicationById(applicationId);
        if (!application) throw new ApiError(404, "Application not found");

        const jobOwner = await getJobWithCompanyOwner(application.jobId);
        if (!jobOwner || jobOwner.recruiterId !== recruiterId) {
            throw new ApiError(403, "You are not allowed to analyze this application");
        }

        const existing = await findAnalysisByApplicationId(applicationId);
        if (existing?.status === "processing") {
            throw new ApiError(409, "Analysis is already in progress for this application");
        }

        await upsertPendingAnalysis(applicationId); // resets to pending even if previously completed — allows re-analysis
        await enqueueAnalysisJob(applicationId);

        return { queued: true };
    },

    getAnalysis: async (recruiterId: string, applicationId: string) => {
        const application = await findApplicationById(applicationId);
        if (!application) throw new ApiError(404, "Application not found");

        const jobOwner = await getJobWithCompanyOwner(application.jobId);
        if (!jobOwner || jobOwner.recruiterId !== recruiterId) {
            throw new ApiError(403, "You are not allowed to view this analysis");
        }

        const result = await findAnalysisByApplicationId(applicationId);
        if (!result) throw new ApiError(404, "Analysis not found");
        return result;
    },
};