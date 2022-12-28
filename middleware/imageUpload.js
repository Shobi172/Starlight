const express = require('express')
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: 'duotrfsbr',
    api_key: '157295577369682',
    api_secret: 'q6lxkpHAPA2YNGnKxvOhdiI6S8I'
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"Starlight",
        allowedFormats:['jpeg','png','jpg']
    }
});
module.exports = {
    cloudinary,storage
};