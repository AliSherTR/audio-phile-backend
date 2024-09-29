import { db } from "../db";

import { Request, Response } from "express";

export const getAllProducts = async (req: Request, res: Response) => {
    const products = await db.product.findMany();
    res.status(200).json(products);
};
