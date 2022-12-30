const mongoose = require("mongoose");
// const {ObjectID} = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;
const cartSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },

  products: [
    {
      product_id: {
        type: ObjectID,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
