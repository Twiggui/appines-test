import express from "express";
import OrderController from "../controllers/order";
import { createOrderValidator } from "../middlewares/validators/createOrder";
const router = express.Router({ mergeParams: true });

const asyncHandler = require("express-async-handler");

// PUBLIC ROUTES

router.post("/", createOrderValidator, asyncHandler(OrderController.createOne));
// router.get("/", asyncHandler(OrderController.get));
router.get("/:orderId", asyncHandler(OrderController.getOne));

// PRIVATE ROUTE (user must be logged)
// VerifyJWT middleware
// RoleVerification middleware

export default router;
