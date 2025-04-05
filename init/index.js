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
    
        await listing.deleteMany({});
        const ownerId = new mongoose.Types.ObjectId("67ea9c98ff073354a5fe88cf");
       indata.data =   indata.data.map((obj) => ({...obj , owner : ownerId}));
        await listing.insertMany(indata.data);
        console.log("Data saved");
}

initdata();