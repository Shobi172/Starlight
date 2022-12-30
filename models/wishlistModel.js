const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectID;
const wishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },

    products: [
      {
        product_id: {
          type: ObjectId,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
