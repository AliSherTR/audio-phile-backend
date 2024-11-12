import { Router } from "express";
import { deleteUser, getAllUsers } from "../Controllers/usersController";
import { verifyAdminToken } from "../Middleware/verifyAdmin";

const router = Router();

router.get("/all-users", verifyAdminToken, getAllUsers);

router.route("/:id").delete(verifyAdminToken, deleteUser);

export default router;
