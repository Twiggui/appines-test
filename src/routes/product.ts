import express from "express";
import ProductController from "../controllers/product";
import { createProductValidator } from "../middlewares/validators/createProduct";
import { updateProductValidator } from "../middlewares/validators/updateProduct";
const router = express.Router({ mergeParams: true });

const asyncHandler = require("express-async-handler");

// PUBLIC ROUTES

router.post(
  "/",
  createProductValidator,
  asyncHandler(ProductController.createOne)
);
router.get("/:productId", asyncHandler(ProductController.getOne));
router.put(
  "/:productId",
  updateProductValidator,
  asyncHandler(ProductController.updateOne)
);
router.delete("/:productId", asyncHandler(ProductController.deleteOne));

// PRIVATE ROUTE (user must be logged)
// VerifyJWT middleware
// RoleVerification middleware

export default router;
