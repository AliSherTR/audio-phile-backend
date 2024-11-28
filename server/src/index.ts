import express from "express";

import productRouter from "./Routes/productRoutes";
import authRouter from "./Routes/authRoutes";
import userRouter from "./Routes/userRoutes";
import eventsRouter from "./Routes/eventRoutes";
import { globalErrorHandler } from "./Middleware/globalErrorHandler";

const app = express();

const port: number = 8000;

// add othe middlewares here like logging and so on

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/users", userRouter);
app.use("/products", productRouter);

app.use("/auth", authRouter);
app.use("/events", eventsRouter);

app.use(globalErrorHandler);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
