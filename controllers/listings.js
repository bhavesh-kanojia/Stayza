const Listing = require("../models/listing.js");
const CustomError = require("../utils/customError.js");

module.exports.index = async (req, res, next) => {
    let allListing = await Listing.find();
    res.render("listings/index.ejs", { allListing });
};
module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
};
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    .populate({path : "reviews",populate :{path : "author"}})
    .populate("owner");
    if (!listing) {
      return next(new CustomError(404, "Listing not found"));
    }
    res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let { listing: newListing } = req.body;
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await new Listing(newListing).save();
    res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      return next(new CustomError(404, "Listing not found"));
    }
    res.render("listings/edit.ejs", { listing });
};
module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    if(req.file){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename};
      await listing.save();
    }
    if (!listing) {
      return next(new CustomError(404, "Listing not found"));
    }
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    if (!deleted) {
      return next(new CustomError(404, "Listing not found"));
    }
    console.log("Deleted : ", deleted);
    res.redirect("/listings");
};