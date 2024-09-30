import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { catchAsync } from "../utils/errorHandler";
import createHttpError from "http-errors";

export const getAllProducts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const products = await db.product.findMany();

        if (!products.length)
            return next(createHttpError(404, "No Products Found"));

        res.status(200).json({
            status: "success",
            data: products,
        });
    }
);

export const createProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, price, description, accessories, features } = req.body;
        const newProduct = await db.product.create({
            data: {
                name,
                price,
                description: description,
                accessories: accessories,
                features: features,
            },
        });
        // Send response
        res.status(201).json({
            status: "success",
            data: {
                product: req.body,
            },
        });
    }
);
