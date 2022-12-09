const mongoose = require("mongoose");
const Category = require("./categoryModel");
const productSchema = new mongoose.Schema({

    name: {
        type:String,
        
    },
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref:'Category'
        
    },
    quantity: {
        type:Number
        
    },
    image: {
        type:String
        
    },
    stock: {
        type:String
        
    },
    price: {
        type:Number
        
    },
    description: {
        type:String
        
    }
    
   

},{timestamps: true});

const Product = mongoose.model('Product',productSchema);
module.exports = Product;