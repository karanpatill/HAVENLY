const mongoose = require('mongoose');
const indata = require('./data.js');
const listing = require('../models/listing.js');

const mongourl = 'mongodb://127.0.0.1:27017/wanderlust';
main().then(function(){
    console.log("MongoDB connected");
}).
catch(err => console.log(err));
async function main(){
    await mongoose.connect(mongourl);
}

const initdata = async () => {
    try {
        await listing.deleteMany({});
        await listing.insertMany(indata.data);
        console.log("Data saved");
    } catch (err) {
        console.error("Error seeding data:", err);
    }
};

initdata();