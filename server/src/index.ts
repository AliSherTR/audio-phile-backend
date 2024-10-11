import express from "express";

import productRouter from "./Routes/productRoutes";
import authRouter from "./Routes/authRoutes";
import { globalErrorHandler } from "./Middleware/globalErrorHandler";
const app = express();

const port: number = 8000;

app.use(express.json());

app.use(productRouter);
app.use(authRouter);

app.use(globalErrorHandler);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
