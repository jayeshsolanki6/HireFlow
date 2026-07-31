import { Worker } from 'bullmq';
import { redisConnection } from './connection.js';

import { getJobById } from '../modules/job/job.repository.js';
import { setAnalysisProcessing, setAnalysisCompleted, setAnalysisFailed } from '../modules/analysis/analysis.repository.js';
import { extractTextFromPdfUrl } from '../utils/pdf.js';
import { getResumeAnalysis } from '../utils/gemini.js';
import { findUserById } from '../modules/auth/auth.repository.js';
import { findApplicationById } from '../modules/application/application.repository.js';

export const analysisWorker = new Worker(
    'analysis-queue',
    async (job) => {
        const { applicationId } = job.data as { applicationId: string };

        await setAnalysisProcessing(applicationId);

        const application = await findApplicationById(applicationId);
        if (!application) throw new Error(`Application ${applicationId} not found`);

        const jobPosting = await getJobById(application.jobId);
        if (!jobPosting) throw new Error(`Job ${application.jobId} not found`);

        const jobDescription = `${jobPosting.description}\n\nRequirements:\n${jobPosting.requirements}`;
        const resumeText = await extractTextFromPdfUrl(application.resumeUrl);

        const result = await getResumeAnalysis(jobDescription, resumeText);

        await setAnalysisCompleted(applicationId, result.score, result);
    },
    { connection: redisConnection }
);

analysisWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

analysisWorker.on("failed", async (job, err) => {
    console.log(`❌ Job ${job?.id} failed`);
    console.error(err);
    if (job?.data?.candidateId && job?.data?.jobId) {
        await setAnalysisFailed(job.data.applicationId);
    }
});
