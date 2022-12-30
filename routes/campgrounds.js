const express = require('express');
const router = express.Router();

const campgrounds = require('../controllers/campgrounds')

const catchAsync = require('../utils/catchAsync');

const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

const Campground = require('../models/campground');

//this is for image upload parses the file data
const multer = require('multer')
const {storage} = require('../cloudinary'); //node autoimatically looks for an index file

const upload = multer({ storage })


//Main Campground Page
router.get('/', catchAsync(campgrounds.index));

//Create
router.get('/new' , isLoggedIn , campgrounds.renderNewForm);

//Create
router.post('/', isLoggedIn, upload.array('image'), validateCampground,  catchAsync(campgrounds.createCampground))

//Read
router.get('/:id', catchAsync(campgrounds.showCampground));

//Update
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

//Update
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))

//Delete
router.delete('/:id', isLoggedIn, isAuthor,  catchAsync(campgrounds.deleteCampground))

module.exports = router