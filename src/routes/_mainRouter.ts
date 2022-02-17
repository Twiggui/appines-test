import orderRouter from "./order";
import productRouter from "./product";
const asyncHandler = require("express-async-handler");

export const mainServerRouter = (app: any) => {
  // PUBLIC ROUTER
  app.use("/product", asyncHandler(productRouter));
  app.use("/order", asyncHandler(orderRouter));

  // PRIVATE ROUTE (user must be logged)
  // VerifyJWT middleware
  // RoleVerification middleware
};
