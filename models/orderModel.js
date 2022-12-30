const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectID;
const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      unique: true,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    address: {
      type: ObjectId,
      required: true,
    },
    products: [
      {
        product_id: {
          type: ObjectId,
          required: true,
          ref: "products",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    expectedDelivery: {
      type: String,
      required: true,
    },
    order_placed_on: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    orderStatus: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
