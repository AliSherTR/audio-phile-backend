import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { GetAllProductsUseCase } from "../../application/use-cases/products/GetAllProductsUseCase";
import { CreateProductUseCase } from "../../application/use-cases/products/CreateProductUseCase";
import { ProductSchema } from "../../infrastructure/validation/ProductValidationSchema";
import { z } from "zod";

export class ProductController {
    constructor(
        private getAllProductsUseCase: GetAllProductsUseCase,
        private createProductUseCase: CreateProductUseCase // Inject other use cases...
    ) {}

    getAllProducts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;

            const result = await this.getAllProductsUseCase.execute(
                page,
                limit,
                search
            );

            if (!result.products.length) {
                return next(createHttpError(404, "No Products Found"));
            }

            res.status(200).json({
                status: "success",
                data: result.products,
                meta: {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    pageSize: result.pageSize,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productData = ProductSchema.parse(req.body);
            const newProduct = await this.createProductUseCase.execute(
                productData
            );

            res.status(201).json({
                status: "success",
                data: {
                    product: newProduct,
                },
            });
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                return next(createHttpError(400, "Invalid product data"));
            }
            if (
                error instanceof Error &&
                "code" in error &&
                error.code === "P2002"
            ) {
                return next(
                    createHttpError(409, "This product already exists")
                );
            }
            next(error);
        }
    };

    // Implement other controller methods...
}
