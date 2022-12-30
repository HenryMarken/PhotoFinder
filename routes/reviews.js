const express = require('express');
const router = express.Router({mergeParams: true}); // the merge params allows us to access the parameter that is pulled from app.js

const Campground = require('../models/campground');
const Review = require('../models/review');

const reviews = require('../controllers/reviews');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')





//Reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//DELETE
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router
