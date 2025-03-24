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
const listings = require('./routes/listing.js');
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
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
   Routes
============================ */

// Redirect to listings page
app.get("/", (req, res) => { 
    res.redirect("/listings");
});


app.use("/listings", listings);
app.use("/users" ,users);
app.use("/posts", posts);




/* ============================
   Server Initialization
============================ */
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://192.168.137.1:${port}`);
});
