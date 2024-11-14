import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { verifyAdminToken } from "../../infrastructure/middlewares/Middleware/verifyAdmin";
import {
    processUpload,
    uploadImage,
} from "../../infrastructure/middlewares/Middleware/uploadMiddleware";
import { validateData } from "../../infrastructure/middlewares/Middleware/validationMiddleware";
import { ProductSchema } from "../../infrastructure/validation/ProductValidationSchema";
// import { ProductController } from '../controllers/ProductController';
// import { validateData } from '../../infrastructure/middlewares/validationMiddleware';
// import { ProductValidationSchema } from '../../infrastructure/validation/ProductValidationSchema';
// import { verifyAdminToken } from '../../infrastructure/middlewares/verifyAdmin';
// import { processUpload, uploadImage } from '../../infrastructure/middlewares/uploadMiddleware';

export const productRouter = (productController: ProductController) => {
    const router = Router();

    //   router.route("/featured").get(productController.getFeaturedProducts);
    //   router.get("/promoted", productController.getPromotedProduct);
    router
        .route("/")
        .get(productController.getAllProducts)
        .post(
            verifyAdminToken,
            uploadImage,
            processUpload,
            validateData(ProductSchema),
            productController.createProduct
        );

    //   router
    //     .route("/:id")
    //     .get(productController.getSingleProduct)
    //     .delete(verifyAdminToken, productController.deleteProduct)
    //     .patch(
    //       verifyAdminToken,
    //       uploadImage,
    //       processUpload,
    //       validateData(ProductValidationSchema),
    //       productController.updateProduct
    //     );

    return router;
};
