const mongoose = require("mongoose");
const Schema = mongoose.Schema;


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
        reviews : [{
            type: Schema.Types.ObjectId,
            ref : 'Reviews',
        }]
    });
    

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;
