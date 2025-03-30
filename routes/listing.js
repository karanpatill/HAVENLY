const express = require('express');
const listing = require('../models/listing.js');
const Review = require('../models/review.js');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema, reviewSchema } = require('../Schema.js');


const validateListing = (req, res, next) => { 
    let { error } = listingSchema.validate(req.body); 
    if (error) { 
        let errMsg = error.details.map(el => el.message).join(','); 
        throw new ExpressError(400, errMsg); 
    } 
    next(); 
};



const validateReview = (req, res, next) => { 
    let { error } = reviewSchema.validate(req.body); 
    if (error) { 
        let errMsg = error.details.map(el => el.message).join(','); 
        throw new ExpressError(400, errMsg); 
    } 
    next(); 
};


router.get("/", wrapAsync(async (req, res) => {
    const listings = await listing.find({});
    res.render('listings/index.ejs', { listings });
}));

// Render form to create a new listing
router.get("/new", (req, res) => {
    res.render('listings/new.ejs');
});

// Create a new listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    let newListing = new listing(req.body);
    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect('/listings');
}));


// Show details of a specific listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id).populate({
      path: 'reviews',
      model: 'Review' // Specify the correct model name here
    });

    if (!list) {
        req.flash('error', 'Listing not found!');
     return  res.redirect('/listings');
    }
    res.render('listings/show.ejs', { list });
  }));
// Render edit form for a listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        req.flash('error', 'Listing not found!');
     return  res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { list });
}));

// Update a listing
router.put("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', 'Listing updated successfully!');
    res.redirect('/listings');
}));

// Delete a listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
}));

router.post("/:id/review", validateReview, wrapAsync(async (req, res) => {
    const list = await listing.findById(req.params.id);
    const { rating, comment } = req.body;
    const newReview = new Review({ rating, comment }); // Use "Review" here
  
    list.reviews.push(newReview);
    await newReview.save();
    req.flash('success', 'Review added successfully!');
    await list.save();
  
    res.redirect(`/listings/${list.id}`);
  }));

  router.delete("/:id/review/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
  }));

module.exports = router;
