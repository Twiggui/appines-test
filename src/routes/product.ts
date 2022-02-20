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
// VerifyJWT middleware that return 401 if JWT isn't valid
// RoleVerification middleware that return 403 if role catched in JWT isn't adequate

export default router;
