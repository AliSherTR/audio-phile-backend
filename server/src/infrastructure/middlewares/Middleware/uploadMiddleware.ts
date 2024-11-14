import { Request, Response, NextFunction } from "express";
import { upload } from "../../../config/multer";
// import { upload } from "../config/multer";

export const uploadImage = upload.single("image");

export const processUpload = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
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
