import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import createHttpError from "http-errors";
import { catchAsync } from "../utils/errorHandler";
const cron = require("node-cron");

cron.schedule(
    "* * * * *",
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            const currentDate = new Date();
            const localISOTime = new Date(
                currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
            ).toISOString();

            const expiredEvents = await db.event.findMany({
                where: { endDate: { lte: localISOTime } },
                select: { productId: true, discount: true, id: true },
            });

            for (const event of expiredEvents) {
                const product = await db.product.findUnique({
                    where: { id: event.productId || undefined },
                    select: { price: true },
                });

                if (!product) continue;
                await db.product.update({
                    where: { id: event.productId || undefined },
                    data: { price: product.price, discountedPrice: 0 },
                });
            }
        } catch (error) {
            console.error("Error in cron job:", error);
            next(createHttpError(500, "Something went wrong."));
        }
    }
);

// this is the controller to get all the events on the admin side
export const getAllEvents = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const events = await db.event.findMany();

        if (!events.length)
            return next(createHttpError(404, "No events found"));

        res.status(200).json({
            status: "success",
            data: events,
        });
    }
);

// this is the controller to get only the active events on the client side
export const getAllActiveEvents = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { activeEvents } = req.body;

        if (!activeEvents.length)
            return next(createHttpError(404, "No active events found"));

        res.status(200).json({
            status: "success",
            data: activeEvents,
        });
    }
);

export const createEvent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, startDate, endDate, image } =
            req.body;

        const productId = parseInt(req.body.productId)
        const discount = parseInt(req.body.discount)

        console.log(req.body)

        const data = await db.$transaction(async (prisma) => {
            // Check if product exists
            const existingProduct = await prisma.product.findUnique({
                where: { id: productId },
                select: { id: true, name: true, price: true },
            });

            if (!existingProduct) {
                return next(
                    createHttpError(
                        404,
                        "No Product with the given id is found"
                    )
                );
            }
            const discountedPrice =
                existingProduct.price * (1 - discount / 100);

            const createdEvent = await prisma.event.create({
                data: {
                    name,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    image,
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

            const updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: { discountedPrice: discountedPrice },
                select: { id: true, name: true, discountedPrice: true },
            });

            return { createdEvent, updatedProduct };
        });

        res.status(201).json({
            status: "success",
            data,
        });
    }
);
