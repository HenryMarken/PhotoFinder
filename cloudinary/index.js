const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:'dcxblk1e6',
    api_key: '613664887767246',
    api_secret: 'KW_KY46KXE2ePTvODYnjaVDl9Lo',
});

const storage  = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'PhotoFinder',
    },
    allowedFormats:['jpeg', 'png', 'jpg']
});

module.exports = {
    cloudinary,
    storage
}