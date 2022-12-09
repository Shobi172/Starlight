const express = require("express");
const user_route = express();
const session = require("express-session");

const userAuth = require("../middleware/userAuth");


const path  = require("path");


const usercontroller = require("../controllers/usercontroller");

user_route.get('/register', usercontroller.GetRegister);

user_route.post('/register', usercontroller.PostRegister);

user_route.get('/otp',usercontroller.GetOtp);

user_route.post('/otp', usercontroller.PostOtp);

user_route.get('/login', usercontroller.GetLogin);

user_route.post('/login', usercontroller.PostLogin);


user_route.get('/', usercontroller.GetHome);

user_route.get('/shop', usercontroller.GetShop);

user_route.get('/about', usercontroller.GetAbout);

user_route.get('/contact', usercontroller.GetContact);

user_route.get('/myaccount',userAuth.verifyUser, usercontroller.GetMyAcct); //

user_route.get('/dress/:id', usercontroller.GetCategories);

user_route.get('/cart',userAuth.verifyUser, usercontroller.GetCart); //

user_route.get('/addtocart/:id',userAuth.verifyUser, usercontroller.GetCartProducts);

user_route.post('/change-product-quantity',userAuth.verifyUser, usercontroller.changeproqty);

user_route.post('/delete-cart-item', usercontroller.DeleteCartPdt);

user_route.get('/checkout', usercontroller.GetCheckout);

user_route.get('/address', usercontroller.GetAddress);

user_route.post('/address', usercontroller.PostAddress);

user_route.get('/thankyou', usercontroller.GetThankyou);

user_route.get('/singleshop/:id', usercontroller.GetSingleshop);

user_route.get('/logout', usercontroller.GetLogout);


module.exports = user_route;