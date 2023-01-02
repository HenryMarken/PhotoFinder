const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({

        url:String,
        filename:String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_100') // virtual property
})

const opts = {toJSON: {virtuals:true}};

const CampgroundSchema = new Schema ({
    title:String,
    images: [ImageSchema],
    geometry: {
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    price: Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId, // this will return the object id of the user in a different collection holding the documents username email and password
        ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

}, opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/photospots/${this._id}">${this.title}</a></strong>` // virtual property
})

CampgroundSchema.post('findOneAndDelete', async function (doc){ //findOneAndDelete middleware for findByIdAndDelete if campground uses different method of delete the middleware findOneAndDelete will not execute
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema);
