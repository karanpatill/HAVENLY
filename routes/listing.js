const express = require('express');
const listing = require('../models/listing.js');
const Review = require('../models/review.js');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner ,validateListing, validateReview , isAuthor} = require('../middleware.js');



router.get("/", wrapAsync(async (req, res) => {
    const listings = await listing.find({});
    res.render('listings/index.ejs', { listings });
}));

// Render form to create a new listing
router.get("/new", isLoggedIn , (req, res) => {
    res.render('listings/new.ejs');
});

// Create a new listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    let newListing = new listing(req.body);
    let owner = req.user._id; // Assuming req.user contains the logged-in user's information
    newListing.owner = owner; // Assign the owner field to the logged-in user's ID
    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect('/listings');
}));


// Show details of a specific listing
router.get("/:id", wrapAsync(async (req, res) => {
  ;
    const { id } = req.params;
    const list = await listing.findById(id).populate({
      path: 'reviews',
      populate :{
        path : 'author',
      }
    }).populate('owner'); 

    if (!list) {
        req.flash('error', 'Listing not found!');
     return  res.redirect('/listings');
    }
    res.render('listings/show.ejs', { list });
  }));

// Render edit form for a listing
router.get("/:id/edit", isLoggedIn , isOwner,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        req.flash('error', 'Listing not found!');
     return  res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { list });
}));

// Update a listing
router.put("/:id",isLoggedIn , isOwner, wrapAsync(async (req, res) => {
    
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', 'Listing updated successfully!');
    res.redirect('/listings');
}));

// Delete a listing
router.delete("/:id",isLoggedIn , isOwner, wrapAsync(async (req, res) => {
    
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
}));


//review routes
router.post("/:id/review", isLoggedIn ,validateReview, wrapAsync(async (req, res) => {
    const list = await listing.findById(req.params.id);
    const { rating, comment } = req.body;
    const newReview = new Review({ rating, comment });
    newReview.author = req.user._id; // Assuming req.user contains the logged-in user's information
  
    list.reviews.push(newReview);
    await newReview.save();
    req.flash('success', 'Review added successfully!');
    await list.save();
  
    res.redirect(`/listings/${list.id}`);
  }));

  router.delete("/:id/review/:reviewId",isAuthor, isLoggedIn, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
  }));

module.exports = router;
