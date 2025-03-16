// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError');
const listing = require('./models/listing.js');
const Review = require('./models/review.js'); 
const { listingSchema, reviewSchema } = require('./Schema.js');

const app = express();
const port = 3000;

// Set up Express and middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Connect to MongoDB
const mongourl = 'mongodb://127.0.0.1:27017/wanderlust';
async function main() {
    await mongoose.connect(mongourl);
    console.log("MongoDB connected");
}
main().catch(err => console.log(err));

/* ============================
   Middleware for Validation
============================ */
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

/* ============================
   Routes
============================ */

// Redirect to listings page
app.get("/", (req, res) => { 
    res.redirect("/listings");
});

/* --------- Listings Routes --------- */

// Display all listings
app.get("/listings", wrapAsync(async (req, res) => {
    const listings = await listing.find({});
    res.render('listings/index.ejs', { listings });
}));

// Render form to create a new listing
app.get("/listings/new", (req, res) => {
    res.render('listings/new.ejs');
});

// Create a new listing
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    let newListing = new listing(req.body);
    await newListing.save();
    res.redirect('/listings');
}));


// Show details of a specific listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id).populate({
      path: 'reviews',
      model: 'Review' // Specify the correct model name here
    });
    if (!list) {
      return res.status(404).send("Listing not found");
    }
    res.render('listings/show.ejs', { list });
  }));

// Render edit form for a listing
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        return res.status(404).send("Listing not found");
    }
    res.render('listings/edit.ejs', { list });
}));

// Update a listing
app.put("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect('/listings');
}));

// Delete a listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

/* --------- Reviews Routes --------- */

// Add a review to a listing
app.post("/listings/:id/review", validateReview, wrapAsync(async (req, res) => {
    const list = await listing.findById(req.params.id);
    const { rating, comment } = req.body;
    const newReview = new Review({ rating, comment }); // Use "Review" here
  
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
  
    res.redirect(`/listings/${list.id}`);
  }));

/* ============================
   Server Initialization
============================ */
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://192.168.137.1:${port}`);
});
