import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { catchAsync } from "../utils/errorHandler";
import { User } from "../types";
import { db } from "../db";
import jwt from "jsonwebtoken";
import { QueryBuilder } from "../utils/queryBuilder";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const queryBuilder = new QueryBuilder();

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

//     async (req: Request, res: Response, next: NextFunction) => {
//         const page = parseInt(req.query.page as string) || 1;
//         const limit = parseInt(req.query.limit as string) || 10;

//         const skip = (page - 1) * limit;

//         const search = req.query.search as string | undefined;

//         let whereClause = {};

//         if (search) {
//             whereClause = {
//                 OR: [{ email: { contains: search, mode: "insensitive" } }],
//             };
//         }

//         const [users, totalUsers] = await Promise.all([
//             db.users.findMany({
//                 where: whereClause,
//                 skip,
//                 take: limit,
//                 select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     role: true,
//                 },
//             }),
//             db.users.count({ where: whereClause }),
//         ]);

//         const totalPages = Math.ceil(totalUsers / limit);

//         return res.status(200).json({
//             status: "success",
//             data: users,
//             meta: {
//                 totalUsers,
//                 totalPages,
//                 currentPage: page,
//                 pageSize: limit,
//             },
//         });
//     }
// );

export const getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const search = req.query.search as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        if (search) {
            queryBuilder.addSearch(search, ["email"]);
        }

        const whereClause = queryBuilder.getWhereClause();
        const pagination = queryBuilder.addPagination(skip, limit);

        const [users, totalUsers] = await Promise.all([
            db.users.findMany({
                where: whereClause,
                ...pagination,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            }),
            db.users.count({ where: whereClause }),
        ]);
        if (!users.length) {
            return next(createHttpError(404, "No Products Found"));
        }

        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            status: "success",
            data: users,
            meta: {
                totalUsers,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    }
);

export const deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) return next(createHttpError(404, "No product found"));

        const userId = parseInt(id);

        try {
            await db.users.delete({
                where: {
                    id: userId,
                },
            });
            res.status(200).json({
                status: "success",
                message: "Product deleted successfully",
            });
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === "P2025" // This is Prisma's code for "Record not found"
            ) {
                return next(createHttpError(404, "No Product Found"));
            }
            next(error);
        }
        next();
    }
);
