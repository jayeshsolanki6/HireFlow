import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { findUserById } from "../modules/auth/auth.repository.js";

interface AccessTokenPayload {
    userId : string,
    role : "candidate" | "recruiter" ;
}

export const authenticate = async (req : Request, res : Response, next : NextFunction)=>{
    try {
        const authHeader = req.headers.authorization!;
    
        const token = authHeader.split(' ')[1];

        if(!token){
            throw new ApiError(401, "Unauthorize.")
        }

        const payload = verifyAccessToken(token) as AccessTokenPayload;

        const userId = payload.userId;
        
        const user = await findUserById(userId);

        if(!user || !user.isActive) {
            throw new ApiError(401, "Unauthorize.")
        }

        req.user = {
            userId : user.id,
            role : user.role
        };

        next();
    } catch (error) {
        next(error);
    }
}