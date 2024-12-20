import { Router } from "express";
import {
    createEvent,
    deleteEvent,
    getAllActiveEvents,
    getAllEvents,
    getSingleEvent,
    updateEvent,
} from "../Controllers/eventController";
import { validateData } from "../Middleware/validationMiddleware";
import { eventSchema } from "../Models/eventModel";
import { filterActiveEvents } from "../Middleware/filterActiveEvents";
import { processUpload, uploadImage } from "../Middleware/uploadMiddleware";
import { verifyAdminToken } from "../Middleware/verifyAdmin";

const router = Router();

router
    .route("/:id")
    .delete(verifyAdminToken, deleteEvent)
    .patch(verifyAdminToken, uploadImage, processUpload , updateEvent);

router.route("/").post(
    uploadImage,
    processUpload,
    verifyAdminToken,
    // validateData(eventSchema),
    createEvent
);

router.route("/:eventId/:productId").get(getSingleEvent);

router.route("/all-admin").get(getAllEvents);

router.route("/all").get(filterActiveEvents, getAllActiveEvents);

export default router;
