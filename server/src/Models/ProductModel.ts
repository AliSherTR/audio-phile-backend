import * as z from "zod";

export const ProductSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    price: z.number().min(1, {
        message: "Price is required",
    }),
    description: z.string(),
    accessories: z.array(z.string()),
    features: z.string(),
});
