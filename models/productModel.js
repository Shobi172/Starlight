const mongoose = require("mongoose");
const Category = require("./categoryModel");


const imageSchema = new mongoose.Schema({
    url:String,
    filename:String
});

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
    image: [{
        url:String,
        filename:String
        
    }],
    
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