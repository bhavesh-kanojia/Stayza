const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const{ listingSchema,reviewSchema,signupSchema } = require("./utils/schemaValidate.js");
const CustomError = require("./utils/customError.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        if(req.method === "POST") {
            req.session.redirectUrl = req.headers.referer;
        }
        else{
            req.session.redirectUrl = req.originalUrl;
        }
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner._id)){
        return res.redirect(`/listings/${id}`);
    }
    next();
});
module.exports.isReviewAuthor = wrapAsync(async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!res.locals.currUser._id.equals(review.author)){
        return res.redirect(`/listings/${id}`);
    }
    next();
});
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body,{abortEarly:false});
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      return next(new CustomError(400,errMsg));
    }
    next();
};
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      return next(new CustomError(400, errMsg));
    }
    next();
};
module.exports.validateSignup = (req, res, next) => {
    let { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      req.flash("error", errMsg);
      req.flash("formData", req.body);
      return res.redirect("/signup");
    }
    next();
};