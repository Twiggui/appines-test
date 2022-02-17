import { ErrorHandler } from "../../helper/error";
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  quantity: Joi.number(),
}).unknown(true);

export const createProductValidator = (req: any, res: any, next: any) => {
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
