const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({
  coupon_code: {
    type: String,
  },
  offer: {
    type: String,
  },
  max_amount: {
    type: String,
  },
  coupon_status: {
    type: String,
    default: "Active",
  },
  used_user_id: [String],
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
