const joi = require('joi');

module.exports.listingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country : joi.string().required(),
   image : {
    filename : joi.string().allow("",null),
    url :joi.string().allow("",null)},
}).required();

module.exports.reviewSchema = joi.object({
    comment: joi.string().required(),
    rating: joi.number().required().min(1).max(5),
}).required();