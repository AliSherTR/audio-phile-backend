import { NextFunction, Request, Response } from "express";

interface ErrorInterface {
    statusCode: number;
    status: string;
    message: string;
}

export const globalErrorHandler = (
    err: ErrorInterface,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err);
    res.status(err.statusCode || 500).json({
        status: err.status || "error",
        message: err.message || "An unknown error occurred",
        error: err,
    });
};
