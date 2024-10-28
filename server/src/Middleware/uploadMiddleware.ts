import { Request, Response, NextFunction } from "express";
import { upload } from "../config/multer";

export const uploadImage = upload.single("image");

export const processUpload = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Convert string 'true'/'false' to boolean for checkbox values
        if (req.body.isPromoted) {
            req.body.isPromoted = req.body.isPromoted === "true";
        }
        if (req.body.isFeatured) {
            req.body.isFeatured = req.body.isFeatured === "true";
        }

        // Add image path if a file was uploaded
        if (req.file) {
            req.body.image = req.file.path;
        }

        next();
    } catch (error) {
        console.error("Error processing upload:", error);
        next(error);
    }
};
