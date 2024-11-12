import { Router } from "express";
import {
    createEvent,
    getAllActiveEvents,
} from "../Controllers/eventController";
import { validateData } from "../Middleware/validationMiddleware";
import { eventSchema } from "../Models/eventModel";
import { filterActiveEvents } from "../Middleware/filterActiveEvents";

const router = Router();

router.route("/event").post(validateData(eventSchema), createEvent);

router.route("/all").get(filterActiveEvents, getAllActiveEvents);

export default router;
