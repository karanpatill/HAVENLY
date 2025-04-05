const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveurl } = require('../middleware.js');

router.get("/signup" , (req , res) => {
    res.render("listings/signup.ejs");
});

router.post(
    "/signup",
    wrapAsync(async (req, res, next) => {
      try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username });
  
        let registeredUser = await User.register(newUser, password);
  
        req.login(registeredUser, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", `Welcome ${username} to Wanderlust!`);
          return res.redirect("/listings");
        });
      } catch (e) {
        req.flash("error", "User already exists!");
        return res.redirect("/signup");
      }
    })
  );
  

router.get("/login" , (req , res) => {
    res.render("listings/login.ejs");
});

router.post("/login"  ,saveurl, passport.authenticate("local" ,
    {failureFlash :true ,failureRedirect :"/login"}  ), async (req , res) => {
        req.flash('success', `Welcome back ${req.user.username}!`);
        res.redirect(res.locals.redirecturl || '/listings');
});

router.get("/logout" , (req , res , next) => {

    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye! Come back soon!');
        res.redirect('/listings');
    })
    
});

module.exports = router;