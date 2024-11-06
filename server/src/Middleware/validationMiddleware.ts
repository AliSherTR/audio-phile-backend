import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const formData: Record<string, any> = {};
            for (const [key, value] of Object.entries(req.body)) {
                if (key === "accessories") {
                    // formData[key] = JSON.parse(value as string);
                } else if (key === "isPromoted" || key === "isFeatured") {
                    formData[key] = value === "true";
                } else {
                    formData[key] = value;
                }
            }

            if (req.file) {
                formData.image = req.file.path;
            }

            const validatedData = schema.parse(formData);
            req.body = validatedData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join(".")} is ${issue.message}`,
                }));
                res.status(406).json({
                    error: "Invalid data",
                    details: errorMessages,
                });
            } else {
                console.error("Validation error:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    };
}
