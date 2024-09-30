import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { catchAsync } from "../utils/errorHandler";

export const getAllProducts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const products = await db.product.findMany();

        if (products.length === 0) return next(new Error("No Products Found"));

        res.status(200).json({
            status: "success",
            data: products,
        });
    }
);
