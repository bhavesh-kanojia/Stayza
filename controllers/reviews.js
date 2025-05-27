const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const CustomError = require("../utils/customError.js");

module.exports.createReview = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(new CustomError(404, "Listing not found"));
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview = async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
};