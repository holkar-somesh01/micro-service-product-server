import express, { Router } from "express";
import {
    activateProduct, adminAddProduct, adminDeleteProduct,
    adminGetAllProducts, adminUpdateProduct, deactivateProduct, getProductDetails
} from "../controller/productController";


const router: Router = express.Router();

router
    // Product Routes
    .get("/products", adminGetAllProducts)
    .post("/add-product", adminAddProduct)
    .put("/update-product/:updateId", adminUpdateProduct)
    .delete("/delete-product/:deleteId", adminDeleteProduct)
    .put("/deactivate-product/:deactiveId", deactivateProduct)
    .put("/activate-product/:activeId", activateProduct)
    .get("/product-details/:productDetailId", getProductDetails);

export default router;
