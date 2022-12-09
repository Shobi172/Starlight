const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const config = require("./config/config");
const path  = require("path");


const port = 3000;
mongoose.connect("mongodb://127.0.0.1:27017/Shopping")

const express = require("express");
const app = express();

const fileupload = require('express-fileupload');

app.use(fileupload());


// for view engine

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static("public"));

app.use(cookieParser());

app.use(session({
    secret: config.sessionSecret,
    saveUninitialized:false,
    cookie:{maxAge: 1000 * 60 * 60 * 24},
    resave: false 
}));

app.use(methodOverride('_method'))

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));






// for user routes


app.use((req,res,next)=>{
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
})
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);


// for admin routes

const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);




app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});