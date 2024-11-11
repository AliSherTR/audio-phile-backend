import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import createHttpError from "http-errors";

export const createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, startDate, endDate, productId, discount } = req.body;

    const data = await db.$transaction(async (prisma) => {
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
            select: { id: true, name: true, price: true },
        });

        if (!existingProduct) {
            return next(
                createHttpError(404, "No Product with the given id is found")
            );
        }

        // Calculate discounted price
        const discountedPrice = existingProduct.price * (1 - discount / 100);

        // Create event
        const createdEvent = await prisma.event.create({
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                product: { connect: { id: productId } },
                discount,
            },
            select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                discount: true,
                productId: true,
            },
        });

        // Update product price
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { price: discountedPrice },
            select: { id: true, name: true, price: true },
        });

        return { createdEvent, updatedProduct };
    });

    res.status(201).json({
        status: "success",
        data,
    });
};
