import { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import createHttpError from "http-errors";
import { db } from "../db";
import { catchAsync } from "../utils/errorHandler";

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
        const productData = req.body;
        try {
            const newProduct = await db.product.create({
                data: productData,
            });
            res.status(201).json({
                status: "success",
                data: {
                    product: newProduct,
                },
            });
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === "P2002" // This is Prisma's code for "Record already exists"
            ) {
                return next(
                    createHttpError(404, "This product already exists")
                );
            }
            next(error);
        }
    }
);

export const getSingleProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) return next(createHttpError(404, "No Product Found"));

        const productId = parseInt(id);

        const product = await db.product.findFirst({
            where: {
                id: productId,
            },
        });

        if (!product) return next(createHttpError(404, "No Product Found"));

        res.status(201).json({
            status: "success",
            id: product,
        });
    }
);

export const deleteProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) return next(createHttpError(404, "No Product Found"));

        const productId = parseInt(id);

        try {
            await db.product.delete({
                where: {
                    id: productId,
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
    }
);

export const updateProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) return next(createHttpError(404, "No Product Found"));

        const productId = parseInt(id);

        try {
            const updatedProduct = await db.product.update({
                where: {
                    id: productId,
                },
                data: {
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                    accessories: req.body.accessories,
                    features: req.body.features,
                    image: req.body.image,
                    isFeatured: req.body.isFeatured,
                    category: req.body.category.toUpperCase(),
                    isPromoted: req.body.isPromoted,
                },
            });
            res.status(200).json({
                status: "success",
                message: "Product deleted successfully",
                data: updatedProduct,
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
    }
);

export const getFeaturedProducts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const featuredProducts = await db.product.findMany({
            where: {
                isFeatured: true,
            },
        });
        if (!featuredProducts.length)
            return next(createHttpError(404, "no products found"));

        res.status(200).json({
            status: "success",
            data: featuredProducts,
        });
    }
);

export const getPromotedProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const promotedProduct = await db.product.findFirst({
            where: {
                isPromoted: true,
            },
        });
        if (!promotedProduct)
            return next(createHttpError(404, "No Product found"));

        res.status(200).json({
            status: "success",
            data: promotedProduct,
        });
    }
);
