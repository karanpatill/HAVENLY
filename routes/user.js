const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');

router.get("/signup" , (req , res) => {
    res.render("listings/signup.ejs");
});

router.post("/signup" , wrapAsync(async (req , res) => {
    try{
        let { email , username , password } = req.body;
        let newUser = new User({ email , username });
        let registeredUser = await User.register(newUser , password);
        req.flash('success', `Welcome ${username} to Wanderlust!`);
        res.redirect('/listings');
    }
   
    catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get("/login" , (req , res) => {
    res.render("listings/login.ejs");
});

router.post("/login"  ,passport.authenticate("local" ,
    {failureFlash :true ,failureRedirect :"/login"}  ), async (req , res) => {
        req.flash('success', `Welcome back ${req.user.username}!`);
        res.redirect("/listings");
});


module.exports = router;