import express from "express";
import OrderController from "../controllers/order";
import { createOrderValidator } from "../middlewares/validators/createOrder";
const router = express.Router({ mergeParams: true });

const asyncHandler = require("express-async-handler");

// PUBLIC ROUTES

router.post("/", createOrderValidator, asyncHandler(OrderController.createOne));
router.get("/", asyncHandler(OrderController.get));
router.get("/:orderId", asyncHandler(OrderController.getOne));

// PRIVATE ROUTE (user must be logged)
// VerifyJWT middleware that return 401 if JWT isn't valid
// RoleVerification middleware that return 403 if role catched in JWT isn't adequate

export default router;
