import express from "express";

import authRouter from "./Routes/authRoutes";
import userRouter from "./Routes/userRoutes";
import eventsRouter from "./Routes/eventRoutes";
import { globalErrorHandler } from "./Middleware/globalErrorHandler";
import { PrismaClient } from "@prisma/client";
import { PrismaProductRepository } from "./infrastructure/database/PrismaProductRepository";
import { GetAllProductsUseCase } from "./application/use-cases/products/GetAllProductsUseCase";
import { CreateProductUseCase } from "./application/use-cases/products/CreateProductUseCase";
import { ProductController } from "./interface-adapters/controllers/productController";
import { productRouter } from "./interface-adapters/routes/productRoutes";
const app = express();

const port: number = 8000;

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const prisma = new PrismaClient();

const productRepository = new PrismaProductRepository(prisma);
const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
const createProductUseCase = new CreateProductUseCase(productRepository);

const productController = new ProductController(
    getAllProductsUseCase,
    createProductUseCase
    // Inject other use cases...
);

app.use("/users", userRouter);
// app.use("/products", productRouter);

app.use("/products", productRouter(productController));
app.use("/auth", authRouter);
app.use("/events", eventsRouter);

app.use(globalErrorHandler);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
