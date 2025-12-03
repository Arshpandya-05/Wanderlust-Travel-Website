const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
   image: {
    url: String,
    filename: String,
  },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
      owner: {
    type: Schema.Types.ObjectId,
    ref: "User", 
  },
    reviews :[
    {
       type: Schema.Types.ObjectId,
       ref:"Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }
});

const Listing = mongoose.model("listings", listingSchema);
module.exports = Listing;