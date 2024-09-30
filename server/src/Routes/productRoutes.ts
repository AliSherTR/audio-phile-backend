import { Router } from "express";
import {
    createProduct,
    getAllProducts,
} from "../Controllers/productController";

const router = Router();

router.route("/").get(getAllProducts).post(createProduct);

export default router;
