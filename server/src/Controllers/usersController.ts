import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { catchAsync } from "../utils/errorHandler";
import { User } from "../types";
import { db } from "../db";
import jwt from "jsonwebtoken";

const signToken = (payload: {}, secret: string) => {
    return jwt.sign(payload, secret);
};

export const signIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const existingUser: User | null = await db.users.findUnique({
            where: {
                email,
            },
        });

        if (!existingUser)
            return next(createHttpError(404, "User does not exist"));

        const comparedPassword = await bcrypt.compare(
            password,
            existingUser?.password
        );

        if (comparedPassword) {
            const token = signToken(
                { email: existingUser.email, role: existingUser.role },
                "secret"
            );
            return res.status(200).json({
                status: "success",
                data: {
                    name: existingUser.name,
                    email: existingUser.email,
                    image: existingUser.image,
                    role: existingUser.role,
                    token,
                },
            });
        } else {
            return next(createHttpError(404, "Invalid Credentials"));
        }
    }
);
export const signUp = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password, image } = req.body;

        const existingUser = await db.users.findUnique({
            where: {
                email,
            },
        });

        if (existingUser)
            return next(createHttpError(400, "User already exists"));

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                image,
            },
        });

        return res.status(201).json({
            status: "Success",
            message: "Account created Successfully",
        });
    }
);
