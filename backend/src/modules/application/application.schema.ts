import { z } from 'zod';

export const updateApplicationStatusSchema = z.object({
    status: z.enum(["applied", "shortlisted", "rejected", "hired"], "Invalid application status"),
});

export const applyJobSchema = z.object({
    jobId: z.uuid("Invalid job id"),
});