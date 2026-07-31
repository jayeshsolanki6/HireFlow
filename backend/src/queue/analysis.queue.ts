import { Queue } from 'bullmq'
import { redisConnection } from './connection.js'

const analysisQueue = new Queue(
    'analysis-queue',
    { 
        connection : redisConnection,
        defaultJobOptions : {
            attempts : 1,
            // backoff : { type : "fixed", delay : 5000 },
            removeOnComplete : true,
            // removeOnFail : 10
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