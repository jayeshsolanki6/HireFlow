import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { analyses } from "../../db/schema/analysis.js";

export const findAnalysisByApplicationId = async (applicationId: string) => {
    const result = await db.select().from(analyses).where(eq(analyses.applicationId, applicationId));
    return result[0];
};

export const upsertPendingAnalysis = async (applicationId: string) => {
    const result = await db
        .insert(analyses)
        .values({ applicationId, status: "pending", score: null, analysis: null })
        .onConflictDoUpdate({
            target: analyses.applicationId,
            set: { status: "pending", score: null, analysis: null, updatedAt: new Date() },
        })
        .returning();
    return result[0];
};

export const setAnalysisProcessing = async (applicationId: string) => {
    await db.update(analyses)
        .set({ status: "processing", updatedAt: new Date() })
        .where(eq(analyses.applicationId, applicationId));
};

export const setAnalysisCompleted = async (applicationId: string, score: number, analysisJson: unknown) => {
    await db.update(analyses)
        .set({ status: "completed", score, analysis: analysisJson, updatedAt: new Date() })
        .where(eq(analyses.applicationId, applicationId));
};

export const setAnalysisFailed = async (applicationId: string) => {
    await db.update(analyses)
        .set({ status: "failed", updatedAt: new Date() })
        .where(eq(analyses.applicationId, applicationId));
};