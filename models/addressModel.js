const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },

  pincode: {
    type: Number,
  },
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
