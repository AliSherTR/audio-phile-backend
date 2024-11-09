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
import { processUpload, uploadImage } from "../Middleware/uploadMiddleware";

const router = Router();

router.route("/featured").get(getFeaturedProducts);
router.get("/promoted", getPromotedProduct);
router
    .route("/")
    .get(getAllProducts)
    .post(
        verifyAdminToken,
        uploadImage,
        processUpload,
        validateData(ProductSchema),
        createProduct
    );

router
    .route("/:id")
    .get(getSingleProduct)
    .delete(verifyAdminToken, deleteProduct)
    .patch(
        verifyAdminToken,
        uploadImage,
        processUpload,
        validateData(ProductSchema),
        updateProduct
    );

export default router;
