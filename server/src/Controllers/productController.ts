import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { catchAsync } from "../utils/errorHandler";
import createHttpError from "http-errors";
import { z } from "zod";
import { ProductSchema } from "../Models/ProductModel";

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
        const validateFields = ProductSchema.safeParse(req.body);
        if (!validateFields.success)
            return next(createHttpError(406, "Invalid Data sent to server"));
        const validData = validateFields.data;
        const newProduct = await db.product.create({
            data: validData,
        });
        res.status(201).json({
            status: "success",
            data: {
                product: newProduct,
            },
        });
    }
);
