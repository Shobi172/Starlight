const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({



    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    phone:{
        type:Number,
        required:true
        
    },

    password:{
        type:String,
        required:true
    },
    
    status:{
        type:Boolean,
        default: true
    }


    

});

module.exports= mongoose.model('User',userSchema);