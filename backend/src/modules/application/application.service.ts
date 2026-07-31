import { ApiError } from "../../utils/ApiError.js";
import {
    countApplicationsByRecruiterId,
    createApplication,
    findApplication,
    findApplicationById,
    findApplicationDetail,
    findApplicationsByCandidateId,
    findApplicationsByJobId,
    findRecentApplicationsByRecruiterId,
    getCompanyById,
    updateApplicationStatus as updateApplicationStatusRepo,
} from "./application.repository.js";
import { getJobById, getJobWithCompanyOwner } from "../job/job.repository.js"; // CONFIRM: adjust path to match your actual job repository
import { getCandidateProfile } from "../candidate/candidate.repository.js"; // CONFIRM: adjust path/name

export const application = {
    applyJob: async (candidateId: string, jobId: string) => {
        const job = await getJobById(jobId);
        if (!job) {
            throw new ApiError(404, "Job not found");
        }
        if (job.jobStatus !== "open") {
            throw new ApiError(400, "This job is not accepting applications");
        }

        const existing = await findApplication(candidateId, jobId);
        if (existing) {
            throw new ApiError(409, "You have already applied to this job");
        }

        const candidate = await getCandidateProfile(candidateId);
        if (!candidate.resumeUrl) {
            throw new ApiError(400, "Please upload a resume to your profile before applying");
        }

        const result = await createApplication(candidateId, jobId, candidate.resumeUrl);

        return result;
    },

    getMyApplications: async (candidateId: string) => {
        const result =  await findApplicationsByCandidateId(candidateId);
        return result;
    },

    getApplicants: async (recruiterId: string, jobId: string) => {
        const jobOwner = await getJobWithCompanyOwner(jobId);
        if (!jobOwner) throw new ApiError(404, "Job not found");
        if (jobOwner.recruiterId !== recruiterId) {
            throw new ApiError(403, "You are not allowed to view applicants for this job");
        }
        return await findApplicationsByJobId(jobId);
    },

    updateApplicationStatus: async (recruiterId: string, applicationId: string, status: string) => {
        const app = await findApplicationById(applicationId);
        if (!app) throw new ApiError(404, "Application not found");

        const jobOwner = await getJobWithCompanyOwner(app.jobId);
        if (!jobOwner || jobOwner.recruiterId !== recruiterId) {
            throw new ApiError(403, "You are not allowed to update this application");
        }

        return await updateApplicationStatusRepo(applicationId, status);
    },

    getApplicationDetail: async (recruiterId: string, applicationId: string) => {
        const detail = await findApplicationDetail(applicationId);
        if (!detail) throw new ApiError(404, "Application not found");

        const jobOwner = await getJobWithCompanyOwner(detail.jobId);
        if (!jobOwner || jobOwner.recruiterId !== recruiterId) {
            throw new ApiError(403, "You are not allowed to view this application");
        }

        return detail;
    },

    getRecruiterDashboardApplications: async (recruiterId: string) => {
        const [totalApplications, recentApplications] = await Promise.all([
            countApplicationsByRecruiterId(recruiterId),
            findRecentApplicationsByRecruiterId(recruiterId, 5),
        ]);
        return { totalApplications, recentApplications };
    },
};