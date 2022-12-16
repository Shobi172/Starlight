const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectID;
const wishlistSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        product: [
            {
                productId: {
                    type: ObjectId,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

const Wishlist = mongoose.model('Wishlist',wishlistSchema);
module.exports = Wishlist;