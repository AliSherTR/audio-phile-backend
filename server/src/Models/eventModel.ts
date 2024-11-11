import { z } from "zod";
export const eventSchema = z.object({
    name: z.string().min(1),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    productId: z.number().int().positive(),
    discount: z.number().min(0).max(100), // Discount percentage
});
