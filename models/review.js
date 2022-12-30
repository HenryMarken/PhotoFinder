//this will be a one to many relationship with our campgrounds one campground with many reviews
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type:Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model("Review", reviewSchema)