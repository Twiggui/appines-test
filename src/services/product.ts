const ObjectId = require("mongoose").Types.ObjectId;
import { ErrorHandler } from "../helper/error";
import { Iproduct } from "../interfaces/product";

export default class ProductServices {
  static createOne = async (productModel: any, productDatas: Iproduct) => {
    try {
      const newProduct = new productModel(productDatas);
      const result = await newProduct.save();

      return result;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  static updateOne = async (
    productModel: any,
    idProduct: string,
    productDatas: Iproduct
  ) => {
    try {
      const result = await productModel.findByIdAndUpdate(
        { _id: idProduct },
        productDatas,
        { new: true }
      );

      return result;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  static getAll = async (productModel: any) => {
    try {
      const result = await productModel.find();

      return result;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  static getOne = async (productModel: any, idProduct: string) => {
    try {
      const [result] = await productModel.find({ _id: ObjectId(idProduct) });

      return result;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  static deleteOne = async (productModel: any, idProduct: string) => {
    try {
      const result = await productModel.findByIdAndRemove({
        _id: ObjectId(idProduct),
      });

      return result;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}
