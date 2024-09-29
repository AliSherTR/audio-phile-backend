import express, { Request, Response } from "express";
import { db } from "./db";

const app = express();

const port: number = 3000;

app.get("/", async (req: Request, res: Response) => {
    const products = await db.product.findMany();
    console.log(products);
    res.status(200).json(products);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
