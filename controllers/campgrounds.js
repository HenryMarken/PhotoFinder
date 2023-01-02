const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = 'pk.eyJ1IjoiaG1hcmtlbiIsImEiOiJjbGJscW5oaW0wOXh4M3ZteHA1M3U5MWZxIn0.qXBwo-Ss6IkM6800w1qtWQ';
const geocoder = mbxGeocoding({accessToken:mapBoxToken});
const { cloudinary } = require("../cloudinary");

module.exports.index = async(req,res) =>{
    const campgrounds = await Campground.find({}); 
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req,res) =>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req,res) =>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400) //we throw the ExpressError becuase we are inside async function and the catchAsync function will catch this and send to next     
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map( f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id; //req.user is automatically loaded in during auth
    await campground.save();
    req.flash('success', 'Succesfully Pinned a New Photo Location');
    res.redirect(`/photospots/${campground._id}`)
}

module.exports.showCampground = async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate({ //.populate simply refers to a document inside a different collection to another documents field that resides in a different field. In this case reviews and author are different collcecitons from campgrounds. If this populate was not here it would only show the object id of the collection author and not username email and password
        path:'reviews', //populate reviews
        populate: { //populate author under reviews * THIS IS A NESTED POPULATE
            path:'author'
        }
    }).populate('author'); 
    if(!campground){
        req.flash('error','This Photo Spot Does Not Exist Anymore')
        return res.redirect('/photospots')
    }
    res.render('campgrounds/show', {campground, msg: req.flash('success')});
}

module.exports.renderEditForm = async (req, res) => {
    const {id}= req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','This Photo Location Does Not Exist Anymore')
        return res.redirect('/photospots')
    }
    res.render('campgrounds/edit', {campground});
}



module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //spread operator expands into indiviual elements so wll return title and location
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }) //update campground, pull from images array, where file name of image array is, in the req.body.deleteImages
    }
    req.flash('success', 'Successfully Updated Photo Spot');
    res.redirect(`/photospots/${campground._id}`)
}

module.exports.deleteCampground = async(req,res) =>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfuly Deleted a Photo Spot');
    res.redirect('/photospots');
}