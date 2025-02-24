const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
 const ejsMate = require('ejs-mate');
 const wrapAsync = require('./utils/wrapAsync.js');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const mongourl = 'mongodb://127.0.0.1:27017/wanderlust';
main().then(function(){
    console.log("MongoDB connected");
}).
catch(err => console.log(err));
async function main(){
    await mongoose.connect(mongourl);
}
app.get("/", async(req, res) => { 
    res.redirect("/listings");
});
// Route to render the form to create a new listing
app.get("/listings/new", (req, res) => {
    res.render('listings/new.ejs');  // Make sure this points to the correct view for creating a new listing
});

// Route to display a specific listing by ID
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        return res.status(404).send("Listing not found");
    }
    res.render('listings/show.ejs', { list });
});

app.get("/listings", async (req, res) => {
    const listings = await listing.find({});
    res.render('listings/index.ejs', { listings });
})
  

app.post("/listings", async (req, res , next) => {
  try{
    let newdata = new listing(req.body);
    await newdata.save();
    console.log(newdata);
    res.redirect('/listings');
  }
  catch(err){
    next(err);
  }
    
});

app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const ID = await listing.findById(id);
    console.log(ID); 
    if (!ID) {
        return res.status(404).send("Listing not found");
    }
    res.render('listings/edit.ejs', { ID });
});

app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const ID = await listing.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
});
app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

app.use((err,res,req , nextTick)=> {
    res.send("Something went wrong");
});

app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on http://192.168.137.1:3000");
});

