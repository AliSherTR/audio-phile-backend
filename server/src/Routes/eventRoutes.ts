import { Router } from "express";
import { createEvent } from "../Controllers/eventController";
import { validateData } from "../Middleware/validationMiddleware";
import { eventSchema } from "../Models/eventModel";

const router = Router();

router.route("/event").post(validateData(eventSchema), createEvent);

export default router;
