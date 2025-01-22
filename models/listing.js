const mongoose = require("mongoose");


    const listingSchema = new mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        location: { type: String, required: true },
        country: { type: String, required: true },
        image: {
            filename: { type: String, required: true },
            url: { type: String, required: true }
        }
    });
    

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;
