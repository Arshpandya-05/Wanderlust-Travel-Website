const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listenController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(wrapAsync(listenController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listenController.createListing));

// New Route
router.get("/new", isLoggedIn, listenController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listenController.renderShowPage))
    .put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listenController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listenController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listenController.renderEditForm));

module.exports = router;
 
