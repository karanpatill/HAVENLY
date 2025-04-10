 const Listing = require('../models/listing.js');
 
 module.exports.index = async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', { listings });
}

module.exports.newListingForm = (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.createListing = async (req, res) => {
    let newListing = new Listing(req.body);
    let image = req.file.path; 
    let filename = req.file.filename;
    newListing.image = { url: image, filename: filename };
    let owner = req.user._id;
    newListing.owner = owner; 
    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect('/listings');
}

module.exports.showListing = async (req, res) => {
    ;
      const { id } = req.params;
      const list = await Listing.findById(id).populate({
        path: 'reviews',
        populate :{
          path : 'author',
        }
      }).populate('owner'); 
  
      if (!list) {
          req.flash('error', 'Listing not found!');
       return  res.redirect('/listings');
      }
      res.render('listings/show.ejs', { list });
    }

    module.exports.editListingForm = async (req, res) => {
        const { id } = req.params;
        const list = await Listing.findById(id);
        if (!list) {
            req.flash('error', 'Listing not found!');
         return  res.redirect('/listings');
        }
        res.render('listings/edit.ejs', { list });
    }

    module.exports.updateListing = async (req, res) => {
    
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        req.flash('success', 'Listing updated successfully!');
        res.redirect('/listings');
    }

    module.exports.deleteListing = async (req, res) => {
    
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash('success', 'Listing deleted successfully!');
        res.redirect('/listings');
    }
    
