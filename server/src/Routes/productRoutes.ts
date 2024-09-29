import { Router } from "express";
import { getAllProducts } from "../Controllers/productController";

const router = Router();

router.route("/").get(getAllProducts);

export default router;
