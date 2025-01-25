const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
 const ejsMate = require('ejs-mate');
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
    const listings =  await listing.find({});
    res.render('listings/index.ejs', { listings });
});

app.get("/listings", async (req, res) => {
    const listings = await listing.find({});
    res.render('listings/index.ejs', { listings });
})
app.get("/listings/new",  (req, res) => {
    res.render('listings/new.ejs');
});

app.post("/listings", async (req, res) => {
    let newdata = new listing(req.body);
    await newdata.save();
    console.log(newdata);
    res.redirect('/listings');
    
});

app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const ID = await listing.findById(id);
    console.log(ID); // Log the retrieved document
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

app.get("/test", (req, res) => {
    res.render('test.ejs');
});

app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on http://192.168.137.1:3000");
});

