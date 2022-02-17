const ObjectId = require("mongoose").Types.ObjectId;
import { ErrorHandler } from "../helper/error";
import { Iorder } from "../interfaces/order";

export default class OrderServices {
  static createOne = async (orderModel: any, orderDatas: Iorder) => {
    try {
      const newOrder = new orderModel(orderDatas);
      const result = await newOrder.save();

      return result;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  static getOne = async (orderModel: any, idOrder: string) => {
    try {
      const [result] = await orderModel.find({ _id: ObjectId(idOrder) });

      return result;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}
