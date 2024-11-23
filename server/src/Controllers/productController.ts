import { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import createHttpError from "http-errors";
import { db } from "../db";
import { catchAsync } from "../utils/errorHandler";
import { QueryBuilder } from "../utils/queryBuilder";
import path from "path";
import * as fs from "fs";
const queryBuilder = new QueryBuilder();

export const getAllProducts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search as string | undefined;

        let whereClause = queryBuilder.getWhereClause();
        const pagination = queryBuilder.addPagination(skip, limit);
        if (search) {
            queryBuilder.addSearch(search, ["name"]);
        }

        const [products, totalItems] = await Promise.all([
            db.product.findMany({
                where: whereClause,
                ...pagination,
                orderBy: { id: "asc" },
            }),
            db.product.count({ where: whereClause }),
        ]);

        if (!products.length) {
            // the response code 204 means no data found
            return next(createHttpError(404, "No Products Found"));
        }

        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            status: "success",
            data: products,
            meta: {
                totalItems,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    }
);

export const createProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const productData = req.body;

        console.log(req.body);

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
                    createHttpError(409, "This product already exists")
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
            data: product,
        });
    }
);

export const deleteProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) return next(createHttpError(404, "No Product Found"));

        const productId = parseInt(id);

        const product = await db.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            return next(createHttpError(404, "No Product Found"));
        }

        // Get the image path associated with the product
        const imagePath = path.join(product.image);

        // Delete the image file from the uploads folder
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error deleting image:", err);
                return res
                    .status(500)
                    .json({ message: "Failed to delete image" });
            }
            console.log("Image successfully deleted");
        });

        await db.product.delete({
            where: {
                id: product.id,
            },
        });
        res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
        });
    }
);

export const updateProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) return next(createHttpError(404, "No Product Found"));

        const productId = parseInt(id);

        const productData = req.body;

        const [existingProduct, updatedProduct] = await db.$transaction([
            db.product.findUnique({
                where: { id: productId },
            }),
            db.product.update({
                where: { id: productId },
                data: productData,
            }),
        ]);

        if (!existingProduct) {
            return next(createHttpError(404, "No Product Found"));
        }

        res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            data: updatedProduct,
        });
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
