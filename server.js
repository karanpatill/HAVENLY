if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // Load environment variables from .env file
}
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingsrouter = require('./routes/listing.js');
const usersrouter = require('./routes/user.js');
const reviewrouter = require('./routes/review.js');
const flash = require('connect-flash');
const app = express();
const session = require('express-session');
const User = require('./models/user.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionoption = session({
    secret: "secret",
    resave: false, 
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
});

app.use(sessionoption); // Session first
app.use(flash());  
     // Flash next
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.successmsg = req.flash('success');  
    res.locals.errormsg = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


const mongourl = 'mongodb://127.0.0.1:27017/wanderlust';
async function main() {
    await mongoose.connect(mongourl);
    console.log("MongoDB connected");
}
main().catch(err => console.log(err));

app.get("/", (req, res) => { 
    res.redirect("/listings");
});


app.use("/listings", listingsrouter);
app.use("/", usersrouter);
app.use("/listings", reviewrouter);



/* ============================
   Server Initialization
============================ */
app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});
