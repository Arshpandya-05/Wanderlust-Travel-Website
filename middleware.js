const Listing = require("./models/listing");
const Review = require("./models/review");  
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema  } = require("./Schema");

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectTo = req.originalUrl;
        req.flash("error", "You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveReturnTo = (req, res, next) => {
    if (req.session.redirectTo) {
        res.locals.redirectTo = req.session.redirectTo;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "Your nor authorised to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};