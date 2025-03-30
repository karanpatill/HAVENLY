const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const cookieParser = require('cookie-parser');
app.use(cookieParser("secretcode"));

// ✅ Use session before flash
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

// ✅ Use flash after session
app.use(flash());

// Middleware to pass flash messages to templates
app.use((req, res, next) => {
    res.locals.successmsg = req.flash('success');  // ✅ Fixed typo
    res.locals.errormsg = req.flash('error');
    next();
});

app.get('/register', (req, res) => {
    let { name = "Anonymous" } = req.query;
    req.session.name = name;  

    if (name === "Anonymous") {
        req.flash('error', "User not registered");  // ✅ Flash error message
    } else {
        req.flash('success', "User registered successfully!");  // ✅ Fixed typo
    }

    res.redirect('/hello');
});

app.get('/hello', (req, res) => {
    res.render("page.ejs", { name: req.session.name });
});

app.get("/greet", function(req, res) {
  let {name = "Anonymous"} = req.cookies;
    res.send(`Welcome back, ${name}`);
});
app.get('/getsignedcookie', function(req, res) {
    res.cookie("fruit", "grape", {signed: true});
    res.send("Signed cookie set");
});
app.get("/verify" ,(req, res) => {
    console.dir(req.signedCookies);
    res.send(req.signedCookies);
});
const port = 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
