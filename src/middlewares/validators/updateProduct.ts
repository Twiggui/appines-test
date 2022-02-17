import { ErrorHandler } from "../../helper/error";
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  category: Joi.string(),
  description: Joi.string(),
  quantity: Joi.number(),
}).unknown(true);

export const updateProductValidator = (req: any, res: any, next: any) => {
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
