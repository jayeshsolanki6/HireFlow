import { NextFunction, Request, Response } from "express";
import { job } from "./job.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";


export const getJobs = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const search = req.query.search as string | undefined;
        const location = req.query.location as string | undefined;
        const jobType = req.query.jobType as 'full_time' | 'part_time' | 'internship' | undefined;
        const minSalary = req.query.minSalary ? parseFloat(req.query.minSalary as string) : undefined;

        const result = await job.getJobs({ search, location, jobType, minSalary });

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

export const getMyJobs = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const recruiterId = req.user.userId;
        const result = await job.getMyJobs(recruiterId);

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

export const deleteJob = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const jobId = req.params.id as string;
        const recruiterId = req.user.userId;

        await job.deleteJob(jobId, recruiterId);

        res.status(200).json(
            new ApiResponse(
                "Job deleted successfully.",
                null
            )
        );
    } catch (error) {
        next(error);
    }
}