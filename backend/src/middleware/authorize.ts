import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

type Role = "candidate" | "recruiter";

export const authorize = (roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!roles.includes(req.user.role)) {
                throw new ApiError(403, "Forbidden");
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}


