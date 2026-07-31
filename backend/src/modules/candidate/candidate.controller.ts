import { NextFunction, Request, Response } from "express";

import { candidate } from "./candidate.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

interface MulterFiles {
    profileImage?: Express.Multer.File[];
    resume?: Express.Multer.File[];
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;
        const { name, bio } = req.body;
        const files = req.files as MulterFiles;
        const profileImageBuffer = files?.profileImage?.[0]?.buffer;
        const resumeBuffer = files?.resume?.[0]?.buffer;

        const result = await candidate.updateProfile({ userId, name, bio, profileImageBuffer, resumeBuffer });

        res.status(200).json(
            new ApiResponse(
                "Profile updated successfully",
                {
                    name : result.name,
                    email : result.email,
                    role : result.role,
                    bio : result.bio,
                    profileImageUrl : result.profileImageUrl,
                    resumeUrl : result.resumeUrl
                }
            )
        );
    } catch (error) {
        next(error);
    }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;
        const result = await candidate.getProfile(userId);

        res.status(200).json(
            new ApiResponse(
                "Profile retrieved successfully",
                {
                    name : result.name,
                    email : result.email,
                    role : result.role,
                    bio : result.bio,
                    profileImageUrl : result.profileImageUrl,
                    resumeUrl : result.resumeUrl
                }
            )
        );
    } catch (error) {
        next(error);
    }
}

export const analyseForCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidateId = req.user.userId;
        const jobId = req.params.jobId as string;

        const result = await candidate.analysisForCandidate(candidateId, jobId);

        res.status(200).json(
            new ApiResponse(
                "Analysis completed successfully", 
                result
            )
        );
    } catch (error) {
        next(error);
    }
};