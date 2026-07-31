import { ApiError } from "../../utils/ApiError.js";
import { getResumeAnalysis } from "../../utils/gemini.js";
import { extractTextFromPdfUrl } from "../../utils/pdf.js";
import { uploadImage, uploadPdf } from "../../utils/uploadToCloudinary.js";
import { findUserById } from "../auth/auth.repository.js";
import { getJobById } from "../job/job.repository.js";
import { getCandidateProfile, updateCandidateProfile } from "./candidate.repository.js";
import { ProfileInput } from "./candidate.types.js";

export const candidate = {
    updateProfile : async (data : ProfileInput) => {
        const profileImageUrl = data.profileImageBuffer ? await uploadImage(data.profileImageBuffer) : null;
        const resumeUrl = data.resumeBuffer ? await uploadPdf(data.resumeBuffer) : null;

        const result = await updateCandidateProfile(data.userId, data.name, data.bio, profileImageUrl, resumeUrl);

        return result;
    },

    getProfile : async (userId : string) => {
        const result = await getCandidateProfile(userId);
        return result;
    },

    analysisForCandidate : async (candidateId : string, jobId : string) => {
        const job = await getJobById(jobId);
        if (!job) throw new ApiError(404, "Job not found");

        const candidate = await findUserById(candidateId);
        if (!candidate?.resumeUrl) {
            throw new ApiError(400, "Please upload a resume to your profile before checking your match score");
        }

        const jobDescription = `${job.description}\n\nRequirements:\n${job.requirements}`;
        const resumeText = await extractTextFromPdfUrl(candidate.resumeUrl);

        const result = await getResumeAnalysis(jobDescription, resumeText);

        return result;
    }
}