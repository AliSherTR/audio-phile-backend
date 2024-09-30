import express from "express";

import productRouter from "./Routes/productRoutes";
import { globalErrorHandler } from "./Middleware/globalErrorHandler";
const app = express();

const port: number = 3000;

app.use(productRouter);

app.use(globalErrorHandler);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
