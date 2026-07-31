import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { application } from "./application.service.js";

export const applyJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidateId = req.user.userId;
        const { jobId } = req.body;

        const result = await application.applyJob(candidateId, jobId);

        res.status(201).json(
            new ApiResponse(
                "Application submitted successfully", 
                result
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getMyApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidateId = req.user.userId;
        const result = await application.getMyApplications(candidateId);

        res.status(200).json(
            new ApiResponse(
                "Applications retrieved successfully", 
                result
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getApplicants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recruiterId = req.user.userId;
        const jobId = req.params.jobId as string;

        const result = await application.getApplicants(recruiterId, jobId);

        res.status(200).json(
            new ApiResponse("Applicants retrieved successfully", result)
        );
    } catch (error) {
        next(error);
    }
};

export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recruiterId = req.user.userId;
        const applicationId = req.params.id as string;
        const { status } = req.body;

        const result = await application.updateApplicationStatus(recruiterId, applicationId, status);

        res.status(200).json(
            new ApiResponse("Application status updated successfully", result)
        );
    } catch (error) {
        next(error);
    }
};

export const getApplicationDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recruiterId = req.user.userId;
        const applicationId = req.params.id as string;
        const result = await application.getApplicationDetail(recruiterId, applicationId);
        res.status(200).json(new ApiResponse("Application retrieved successfully", result));
    } catch (error) {
        next(error);
    }
};

export const getRecruiterDashboardApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recruiterId = req.user.userId;
        const result = await application.getRecruiterDashboardApplications(recruiterId);
        res.status(200).json(new ApiResponse("Recent applications retrieved successfully", result));
    } catch (error) {
        next(error);
    }
};