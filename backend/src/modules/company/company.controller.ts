import { NextFunction, Request, Response } from "express";
import { company } from "./company.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const createOrUpdateCompany = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const {name, about, website} = req.body;
        const logoBuffer = req.file?.buffer;
        const recruiterId = req.user.userId;

        const result = await company.createOrUpdateCompany({recruiterId, name, logoBuffer, about, website});

        res.status(201).json(
            new ApiResponse(
                "Company created successfully",
                {
                    name : result.name,
                    logoUrl : result.logoUrl,
                    about : result.about,
                    website : result.website
                }
            )
        )
    } catch (error) {
        next(error);
    }
}

export const getMyCompany = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const recruiterId = req.user.userId;

        const result = await company.getMyCompany(recruiterId);

        res.status(200).json(
            new ApiResponse(
                "Company retrieved successfully",
                {
                    name : result.name,
                    logoUrl : result.logoUrl,
                    about : result.about,
                    website : result.website
                }
            )
        )
    } catch (error) {
        next(error);
    }
}

// export const updateCompany = async (req : Request, res : Response, next : NextFunction) => {
//     try {
//         const recruiterId = req.user.userId;
//         const {name, about, website} = req.body;
//         const logoBuffer = req.file?.buffer;

//         const result = await company.updateCompany({recruiterId, name, logoBuffer, about, website});

//         res.status(200).json(
//             new ApiResponse(
//                 "Company updated successfully",
//                 result
//             )
//         )
//     } catch (error) {
//         next(error);
//     }
// }