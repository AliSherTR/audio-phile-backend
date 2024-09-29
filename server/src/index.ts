import express from "express";

import productRouter from "./Routes/productRoutes";
const app = express();

const port: number = 3000;

app.use(productRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
