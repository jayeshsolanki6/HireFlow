import { NextFunction, Request, Response } from "express";
import { job } from "./job.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";


export const createJob = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { title, description, requirements, salaryMin, salaryMax, location, jobType, jobStatus, deadline } = req.body;
        const recruiterId = req.user.userId;

        const result = await job.createJob({
            recruiterId,
            title, 
            description, 
            requirements, 
            salaryMin, 
            salaryMax, 
            location, 
            jobType, 
            jobStatus, 
            deadline 
        });

        res.status(201).json(
            new ApiResponse(
                "Job created successfully.",
                result
            )
        );
    } catch (error) {
        next(error);
    }
}

export const getAllJobs = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const recruiterId = req.user.userId;
        const result = await job.getAllJobs(recruiterId);

        res.status(200).json(
            new ApiResponse(
                "Jobs retrieved successfully.",
                result
            )
        );
    } catch (error) {
        next(error);
    }
}

export const getJob = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const jobId = req.params.id as string;
        const result = await job.getJob(jobId);

        res.status(200).json(
            new ApiResponse(
                "Job retrieved successfully.",
                result
            )
        );
    } catch (error) {
        next(error);
    }
}

export const updateJob = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const jobId = req.params.id as string;
        const recruiterId = req.user.userId;
        const { title, description, requirements, salaryMin, salaryMax, location, jobType, jobStatus, deadline } = req.body;

        const result = await job.updateJob(jobId, {
            recruiterId,
            title,
            description,
            requirements,
            salaryMin,
            salaryMax,
            location,
            jobType,
            jobStatus,
            deadline
        });

        res.status(200).json(
            new ApiResponse(
                "Job updated successfully.",
                result
            )
        );
    } catch (error) {
        next(error);
    }
}

export const closeJob = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const jobId = req.params.id as string;
        const recruiterId = req.user.userId;

        const result = await job.closeJob(jobId, recruiterId);

        res.status(200).json(
            new ApiResponse(
                "Job closed successfully.",
                result
            )
        );
    } catch (error) {
        next(error);
    }
}