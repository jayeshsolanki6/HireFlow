import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export const uploadImage = async (buffer: Buffer): Promise<string> => {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "hireflow/profile_images",
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Upload failed: no result returned"));
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });

    return result.secure_url;
};


export const uploadPdf = async (buffer: Buffer): Promise<string> => {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "hireflow/resumes",
                resource_type: "auto",
                format: "pdf",
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("PDF upload failed: no result returned"));
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });

    return result.secure_url;
};