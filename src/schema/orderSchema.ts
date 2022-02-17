import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  date: { type: Date, required: true },
  productList: {
    type: [{ productId: String, price: Number, quantity: Number }],
    required: true,
  },
  price: { type: Number, required: true },
});

export default OrderSchema;
