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

  static get = async (req: any, res: any, next: any) => {
    const mongoConnection = await mongoConnect();
    const OrderModel = await mongoConnection.model("order", OrderSchema);
    try {
      // retreive and format datas
      const date: Date = req.query.date ? new Date(req.query.date) : null;
      const startDate: Date = date ? new Date(date.setHours(0, 0, 0)) : null;
      const endDate: Date = date ? new Date(date.setHours(23, 59, 59)) : null;
      const includedProducts: string[] = req.query.includedProducts
        ? JSON.parse(req.query.includedProducts)
        : null;
      const minimalPrice: number = parseInt(req.query.minimalPrice);
      const sort: string[] = req.query.sort_by
        ? JSON.parse(req.query.sort_by)
        : null;
      const field: string[] = req.query.field
        ? JSON.parse(req.query.field)
        : null;
      const pageNumber: number = parseInt(req.query.pageNumber);
      const numberPerPage: number = parseInt(req.query.numberPerPage);

      // Default search (equal get All)
      // If defaultOption = true, the pipeline only have one step match{} that return all results
      let defaultOption: boolean = false;
      if (Object.keys(req.query).length === 0) {
        defaultOption = true;
      }

      // Build pipeline step object - sort options
      const sortOptions: any = sort ? {} : null;
      if (sort) {
        for (const option of sort) {
          const sortKey: any = option.split(".")[0];
          const sortOrder: any = parseInt(option.split(".")[1]);
          sortOptions[sortKey] = sortOrder;
        }
      }
      // Build pipeline step object - select field options
      const selectFieldOptions: any = field ? {} : null;
      if (field) {
        for (const option of field) {
          const fieldKey: any = option.split(".")[0];
          const fieldSelect: any = parseInt(option.split(".")[1]);
          selectFieldOptions[fieldKey] = fieldSelect;
        }
      }

      const order = await OrderServices.get(
        OrderModel,
        defaultOption,
        startDate,
        endDate,
        includedProducts,
        minimalPrice,
        sortOptions,
        selectFieldOptions,
        pageNumber,
        numberPerPage
      );

      if (!order) {
        throw new ErrorHandler(404, "order not found");
      }

      const response = {
        query: req.query,
        count: order.numberOfResults,
        result: order.data,
      };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}
