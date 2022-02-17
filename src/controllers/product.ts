import { ErrorHandler } from "../helper/error";
import { Iproduct } from "../interfaces/product";
import ProductSchema from "../schema/productSchema";
import ProductServices from "../services/product";
import { mongoConnect } from "../services/utils/database";

export default class ProductController {
  static createOne = async (req: any, res: any, next: any) => {
    const mongoConnection = await mongoConnect();
    const ProductModel = await mongoConnection.model("products", ProductSchema);
    try {
      const productDatas: Iproduct = req.body;

      const product = await ProductServices.createOne(
        ProductModel,
        productDatas
      );

      res.status(201).send(product);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static updateOne = async (req: any, res: any, next: any) => {
    const mongoConnection = await mongoConnect();
    const ProductModel = await mongoConnection.model("products", ProductSchema);
    try {
      const productId: string = req.params.productId;
      const productDatas: Iproduct = req.body;

      if (!productDatas) {
        throw new ErrorHandler(400, "update product data missing");
      }

      const product = await ProductServices.updateOne(
        ProductModel,
        productId,
        productDatas
      );

      if (!product) {
        throw new ErrorHandler(404, "product not found");
      }

      res.status(200).send(product);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static getOne = async (req: any, res: any, next: any) => {
    const mongoConnection = await mongoConnect();
    const ProductModel = await mongoConnection.model("products", ProductSchema);
    try {
      const productId: string = req.params.productId;
      const product = await ProductServices.getOne(ProductModel, productId);

      if (!product) {
        throw new ErrorHandler(404, "product not found");
      }

      res.status(200).send(product);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static deleteOne = async (req: any, res: any, next: any) => {
    const mongoConnection = await mongoConnect();
    const ProductModel = await mongoConnection.model("products", ProductSchema);
    try {
      const productId: string = req.params.productId;
      const product = await ProductServices.deleteOne(ProductModel, productId);

      if (!product) {
        throw new ErrorHandler(404, "product not found");
      }

      res.status(200).send(product);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}
