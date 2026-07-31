import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { analysis } from './analysis.service.js'

export const analyzeAllForJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recruiterId = req.user.userId;
        const jobId = req.params.jobId as string;
        const result = await analysis.analyzeAllForJob(recruiterId, jobId);
        res.status(202).json(
            new ApiResponse(
                "Analysis queued successfully", 
                result
            )
        );
    } catch (error) {
        next(error);
    }
};

export const analyzeSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recruiterId = req.user.userId;
        const applicationId = req.params.applicationId as string;
        const result = await analysis.analyseSingle(recruiterId, applicationId);
        res.status(202).json(new ApiResponse(
            "Analysis queued successfully", 
            result
        )
    );
    } catch (error) {
        next(error);
    }
};

export const getAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recruiterId = req.user.userId;
        const applicationId = req.params.applicationId as string;
        const result = await analysis.getAnalysis(recruiterId, applicationId);
        res.status(200).json(new ApiResponse(
            "Analysis retrieved successfully", 
            result
        )
    );
    } catch (error) {
        next(error);
    }
};
