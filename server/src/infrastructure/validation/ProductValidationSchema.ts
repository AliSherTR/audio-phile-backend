import * as z from "zod";

export const ProductSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    price: z
        .string()
        .min(1, { message: "Price is required" })
        .transform(Number),
    description: z.string().min(1, { message: "Description is required" }),
    features: z.string().min(1, { message: "Features are required" }),
    category: z.enum(["HEADPHONES", "EARPHONES", "SPEAKERS"] as const),

    isPromoted: z.boolean().optional().default(false),
    isFeatured: z.boolean().optional().default(false),
    accessories: z.array(z.string()).optional(),
    image: z.any().optional(),
    stock: z.string().transform(Number),
});

export type CreateProductDTO = z.infer<typeof ProductSchema>;
