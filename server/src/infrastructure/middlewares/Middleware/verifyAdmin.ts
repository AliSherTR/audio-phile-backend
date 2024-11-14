import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../../../types";
import { db } from "../../../db";
// import { db } from "../db";
// import { User } from "../types";

interface CustomJwtPayload extends JwtPayload {
    email: string;
    role: string;
}

export const verifyAdminToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next(createHttpError(401, "Unauthorized"));

    try {
        const decoded = jwt.verify(token, "secret") as CustomJwtPayload;

        if (decoded.role !== "ADMIN") {
            return next(createHttpError(403, "Access denied"));
        }
        const user: User | null = await db.users.findUnique({
            where: { email: decoded.email },
        });

        if (!user) {
            return next(createHttpError(404, "User not found"));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(createHttpError(401, "Invalid Token"));
    }
};
