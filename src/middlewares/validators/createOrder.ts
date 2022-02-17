import { ErrorHandler } from "../../helper/error";
const Joi = require("joi");

const schema = Joi.object({
  productList: Joi.array().items().required(),
}).unknown(true);

export const createOrderValidator = (req: any, res: any, next: any) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      throw new ErrorHandler(400, error.message);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
