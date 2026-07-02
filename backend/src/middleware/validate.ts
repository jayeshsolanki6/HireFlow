import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod/v3";


export const validate = (schema : any, source : 'body' | 'cookies' | 'headers')=>{
    return (req : Request, res : Response, next : NextFunction) => {
        try {
            schema.parse(req[source]);
            next();
        } catch (error) {
            if(error instanceof ZodError){
                return res.status(400).json({
                    success : false,
                    error,
                    message : error.errors[0].message,
                })
            }
            next(error);
        }
    }
}