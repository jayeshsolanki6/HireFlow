import { Queue } from 'bullmq'
import { redisConnection } from './connection.js'

const analysisQueue = new Queue(
    'analysis-queue',
    {
        connection: redisConnection,
        defaultJobOptions: {
            attempts: 1,
            removeOnComplete: true,
            removeOnFail: true,
        }
    }
)

export const enqueueAnalysisJob = async (applicationId: string) => {
    await analysisQueue.add(
        "analyze-application",
        { applicationId },
        { jobId: applicationId } // dedupes: same id can't be double-queued while waiting/active
    );
};