import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../utils/ApiResponse.js";
import { savedJob } from "./savedJob.service.js";

export const saveJob = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const jobId = req.params.jobId as string;
        const userId = req.user.userId;

        await savedJob.saveJob(userId, jobId);

        res.status(201).json(
            new ApiResponse(
                "Job saved successfully",
                {}
            )
        )
    } catch (error) {
        next(error);
    }
}

export const getSavedJobs = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const userId = req.user.userId;
        const result = await savedJob.getSavedJobs(userId);
        res.status(200).json(
            new ApiResponse(
                "Saved jobs retrieved successfully",
                result
            )
        )
    } catch (error) {
        next(error);
    }
}

export const removeSavedJob = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const jobId = req.params.jobId as string;
        const userId = req.user.userId;

        await savedJob.removeSavedJob(userId, jobId);

        res.status(200).json(
            new ApiResponse(
                "Saved job removed successfully",
                {}
            )
        )
    } catch (error) {
        next(error);
    }
}