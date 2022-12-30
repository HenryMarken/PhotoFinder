const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');
const { application } = require('express');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '6392d58e0677343649d676f1',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`, // sample returns a random element of the array
            images:  [
                {
                  url: 'https://res.cloudinary.com/dcxblk1e6/image/upload/v1670824530/YelpCamp/qucoovr2knjerqhwhmkv.jpg',
                  filename: 'YelpCamp/qucoovr2knjerqhwhmkv',
                },
                {
                  url: 'https://res.cloudinary.com/dcxblk1e6/image/upload/v1670824530/YelpCamp/cscnld4m8cifrntojspj.png',
                  filename: 'YelpCamp/cscnld4m8cifrntojspj',
                },
                {
                  url: 'https://res.cloudinary.com/dcxblk1e6/image/upload/v1670824530/YelpCamp/hjsqogdkuy546fgz43u0.jpg',
                  filename: 'YelpCamp/hjsqogdkuy546fgz43u0',
                },

            ],
            
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type:"Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
        })
        await camp.save();
    }
}

// call unsplash and return small image
// async function seedImg() {
//     try {
//         const resp = await axios.get('https://api.unsplash.com/photos/random', { 
//         params: {
//             client_id: '7Rb8zCAuIsvo6fn8Ky9-NZdVgBXADzgJfnyUrPOexqk',
//             collections: 1114848,
//         },
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept-Encoding': 'application/json',
//             // 'Connection':'keep-SpeechRecognitionAlternative',
//             // 'Server':'Cowboy',
//             // 'Content-type': 'applications/json',
//             // 'Access-Control-Allow-Origin': '*',
//             // 'Access-Control-Request-Method': '*',
//             // 'Access-Control-Allow-Headers': '*',
//             // 'Access-Control-Expose-Headers': 'Link,X-Total,X-Per-Page,X-RateLimit-Limit,X-RateLimit-Remaining',
//             // 'Cache-Control': 'private,max-age=0,stale-if-error=3600,stale-while-revalidate=0',
//             // 'X-Unsplash-Version': 'v1',
//             // 'Content-Language': 'en',
//             // 'Etag': 'W/"dd2dfc815947cb85ebb4e25f52c8b9a2"',
//             // 'X-Ratelimit-Limit': '50',
//             // 'X-Ratelimit-Remaining': '48',
//             // 'X-Request-Id': '13372fbb-13a6-4c24-b0d6-24c60f4e83d9',
//             // 'X-Runtime': '0.038152',
//             // 'Content-Encoding': 'br',
//             // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
//             // 'Via': '1.1 vegur, 1.1 varnish, 1.1 varnish',
//             // 'Accept-Ranges': 'bytes',
//             // 'Date': 'Mon, 28 Nov 2022 05:10:58 GMT',
//             // 'X-Served-By': 'cache-iad-kiad7000146-IAD, cache-yyc1430030-YYC',
//             // 'X-Cache': 'MISS, MISS',
//             // 'X-Cache-Hits': '0, 0',
//             // 'X-Timer': 'S1669612258.073329,VS0,VE118',
//             // 'Vary': 'Accept-Encoding, Origin,Authorization,Accept-Language,Accept',
//             // 'transfer-encdoing': 'chunked',
//         },
//         });
//         console.log(resp.data.urls.small)
//         return resp.data.urls.small
//     } catch (err) {
//         console.error(err)
//     }
// }

seedDB().then(() => {
    mongoose.connection.close();
})