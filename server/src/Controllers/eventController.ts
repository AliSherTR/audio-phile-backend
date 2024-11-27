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

export const getSingleEvent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId, productId } = req.params;

        const event = await db.event.findUnique({
            where: {
                id: parseInt(eventId),
            },
            select: {
                name: true,
                image: true,
                discount: true,
                endDate: true,
            },
        });

        const product = await db.product.findUnique({
            where: {
                id: parseInt(productId),
            },
            select: {
                id: true,
                name: true,
                discountedPrice: true,
                category: true,
                image: true,
            },
        });

        if (!event || !product) {
            return next(createHttpError(404, "No data found for the event"));
        }

        res.status(200).json({
            status: "success",
            data: {
                event,
                product,
            },
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
        console.log("request reached here");
        const { name, startDate, endDate, image } = req.body;

        const productId = parseInt(req.body.productId);
        const discount = parseInt(req.body.discount);

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

export const deleteEvent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const eventId = parseInt(id);

        const existingEvent = await db.event.findUnique({
            where: {
                id: eventId,
            },
        });

        if (!existingEvent) {
            return next(createHttpError(404, "The event does not exist"));
        }

        await db.event.delete({
            where: { id: existingEvent.id },
        });
        res.json({ status: "success", message: "Event Deleted Successfully" });
    }
);

export const updateEvent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        console.log("UPDATE EVENT RUNNING")
        const { id } = req.params;
        const { name, startDate, endDate, image } = req.body;

        console.log(req.body)

        const [existingEvent, updatedEvent] = await db.$transaction([
            db.event.findUnique({
                where: { id: parseInt(id) },
            }),
            db.event.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    startDate: new Date(startDate),
                    endDate = new Date(endDate),
                    
                },
            }),
        ]);

        if (!existingEvent) {
            return next(createHttpError(404, "No Event Found"));
        }

        res.status(200).json({
            status: "success",
            message: "Event updated successfully",
            data: updatedEvent,
        });
    }
);
