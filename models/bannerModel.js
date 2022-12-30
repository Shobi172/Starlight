const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    Heading: {
      type: String,
    },
    Subheading: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
