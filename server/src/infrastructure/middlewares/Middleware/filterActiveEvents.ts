import { Request, Response, NextFunction } from "express";
import { db } from "../db";

export const filterActiveEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const currentDate = new Date();
        const localISOTime = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        ).toISOString();

        const activeEvents = await db.event.findMany({
            where: {
                startDate: { lte: localISOTime },
                endDate: { gte: localISOTime },
            },
            include: {
                product: true,
            },
        });

        req.body.activeEvents = activeEvents;

        next();
    } catch (error) {
        console.error("Error filtering active events:", error);
        next(error);
    }
};
