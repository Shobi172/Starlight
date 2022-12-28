const express = require("express");
const user_route = express();

const session = require("express-session");

const userAuth = require("../middleware/userAuth");


const path  = require("path");


const usercontroller = require("../controllers/userController");


// Register And Login Section

user_route.get('/register', usercontroller.GetRegister);

user_route.post('/register', usercontroller.PostRegister);

user_route.get('/otp',usercontroller.GetOtp);

user_route.post('/otp', usercontroller.PostOtp);

user_route.get('/login', usercontroller.GetLogin);

user_route.post('/login', usercontroller.PostLogin);


// Home Page sections

user_route.get('/', usercontroller.GetHome);

user_route.get('/shop', usercontroller.GetShop);

user_route.get('/singleshop/:id', usercontroller.GetSingleshop);

user_route.get('/about', usercontroller.GetAbout);

user_route.get('/contact', usercontroller.GetContact); //

user_route.get('/dress/:id', usercontroller.GetCategories);


// Cart Section

user_route.get('/cart',userAuth.verifyUser, usercontroller.GetCart); //

user_route.get('/addtocart/:id',userAuth.verifyUser, usercontroller.GetCartProducts);

user_route.post('/change-product-quantity',userAuth.verifyUser, usercontroller.changeproqty);

user_route.post('/delete-cart-item', usercontroller.DeleteCartPdt);



// Order Section

user_route.get('/checkout', usercontroller.GetCheckout);

user_route.post('/orderconfirmed', usercontroller.confirmOrder);

user_route.get('/ordersuccess/:oid', usercontroller.orderSuccess);

user_route.get('/orderhistory', usercontroller.orderHistory);

user_route.get('/orderproducts/:oid', usercontroller.orderProducts);


// Payment Section

user_route.post('/verifyPayment', usercontroller.verifyPayment);

user_route.get('/paymentFail', usercontroller.paymentFailure);


// Search Section

user_route.post('/singleshop', usercontroller.GetSearch);


// Wishlist Section

user_route.get('/wishlist',userAuth.verifyUser, usercontroller.GetWishlist);

user_route.get('/addtowishlist/:id', usercontroller.AddWishlistProducts);

user_route.get('/wishtocart/:id',userAuth.verifyUser, usercontroller.wishlisttocart);

user_route.post('/delete-wishlist-item', usercontroller.DeleteWishlistPdt);


// Checkout Address Section

user_route.get('/address', usercontroller.GetAddress);

user_route.post('/address', usercontroller.PostAddress);

user_route.get('/thankyou', usercontroller.GetThankyou);



// Profile Section

user_route.get('/myaccount',userAuth.verifyUser, usercontroller.profileRender);

user_route.get('/addprofile', usercontroller.addAddressRender);

user_route.post('/addprofile', usercontroller.PostProfile);

user_route.get('/editprofile/:aid', usercontroller.editProfile);

user_route.post('/editprofile/:aid', usercontroller.editAddressPost);

user_route.get('/deleteprofile/:aid', usercontroller.deleteAddress);


// Change Password Section

user_route.get('/changepassword',usercontroller.GetChangePassword);

user_route.post('/changepassword',usercontroller.PostChangePassword);


// Coupon Section

user_route.post('/couponcheck',usercontroller.couponCheck);


// Logout

user_route.get('/logout', usercontroller.GetLogout);


module.exports = user_route;