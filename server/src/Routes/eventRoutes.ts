import { Router } from "express";
import {
    createEvent,
    getAllActiveEvents,
    getAllEvents,
} from "../Controllers/eventController";
import { validateData } from "../Middleware/validationMiddleware";
import { eventSchema } from "../Models/eventModel";
import { filterActiveEvents } from "../Middleware/filterActiveEvents";
import { processUpload, uploadImage } from "../Middleware/uploadMiddleware";
import { verifyAdminToken } from "../Middleware/verifyAdmin";

const router = Router();

router
    .route("/")
    .post(
        uploadImage,
        processUpload,
        verifyAdminToken,
        // validateData(eventSchema),
        createEvent
    );

    router.route("/all-admin").get(getAllEvents)

router.route("/all").get(filterActiveEvents, getAllActiveEvents);

export default router;
