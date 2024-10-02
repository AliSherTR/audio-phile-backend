import * as z from "zod";

export const ProductSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    price: z.number().min(1, {
        message: "Price is required",
    }),
    description: z.string().min(1, {
        message: "description is required",
    }),
    accessories: z.array(z.string()),
    category: z.enum(["HEADPHONES", "EARPHONES", "SPEAKERS"]),
    image: z.string(),
    features: z.string().min(1, {
        message: "features are required",
    }),
    isFeatured: z.boolean(),
});
