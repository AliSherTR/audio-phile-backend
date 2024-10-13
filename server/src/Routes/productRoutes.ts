import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getPromotedProduct,
    getSingleProduct,
    updateProduct,
} from "../Controllers/productController";
import { validateData } from "../Middleware/validationMiddleware";
import { ProductSchema } from "../Models/ProductModel";
import { verifyAdminToken } from "../Middleware/verifyAdmin";
const productController from "../../../index"

const router = Router();

router.route("/featured").get(getFeaturedProducts);
router.get("/promoted", getPromotedProduct);
router
    .route("/")
    .get(getAllProducts)
    .post(verifyAdminToken, validateData(ProductSchema), createProduct);

router
    .route("/:id")
    .get(getSingleProduct)
    .delete(verifyAdminToken, deleteProduct)
    .patch(validateData(ProductSchema), verifyAdminToken, updateProduct);

export default router;
