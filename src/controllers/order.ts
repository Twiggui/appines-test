import { ErrorHandler } from "../helper/error";
import { Iorder } from "../interfaces/order";
import OrderSchema from "../schema/orderSchema";
import OrderServices from "../services/order";
import { mongoConnect } from "../services/utils/database";

export default class OrderController {
  static createOne = async (req: any, res: any, next: any) => {
    const mongoConnection = await mongoConnect();
    const OrderModel = await mongoConnection.model("order", OrderSchema);
    try {
      const orderDatas: Iorder = req.body;

      let totalPrice: number = 0;
      for (const product of orderDatas.productList) {
        totalPrice += product.price * product.quantity;
      }

      orderDatas.price = totalPrice;
      orderDatas.date = new Date();

      const order = await OrderServices.createOne(OrderModel, orderDatas);

      res.status(201).send(order);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static getOne = async (req: any, res: any, next: any) => {
    const mongoConnection = await mongoConnect();
    const OrderModel = await mongoConnection.model("order", OrderSchema);
    try {
      const orderId: string = req.params.orderId;
      const order = await OrderServices.getOne(OrderModel, orderId);

      if (!order) {
        throw new ErrorHandler(404, "order not found");
      }

      res.status(200).send(order);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}
