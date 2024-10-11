import { Router } from "express";
import { signIn, signUp } from "../Controllers/usersController";
import { validateData } from "../Middleware/validationMiddleware";
import { SignInSchema, SignUpSchema } from "../Models/userModel";

const router = Router();

router.post("/signup", validateData(SignUpSchema), signUp);
router.post("/signin", validateData(SignInSchema), signIn);

export default router;
