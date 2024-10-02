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

const router = Router();

router.route("/featured").get(getFeaturedProducts);
router.get("/promoted", getPromotedProduct);
router
    .route("/")
    .get(getAllProducts)
    .post(validateData(ProductSchema), createProduct);

router
    .route("/:id")
    .get(getSingleProduct)
    .delete(deleteProduct)
    .patch(validateData(ProductSchema), updateProduct);

export default router;
