const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // ✅ Ensure correct import

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    image: {
        filename: { type: String, required: true },
        url: { type: String, required: true }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review", // ✅ Ensure it matches the model name
        }
    ]
});

// ✅ Fixing the delete middleware
listingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        });
    }
});

const Listing = mongoose.model("Listing", listingSchema); // ✅ Capitalized

module.exports = Listing;
