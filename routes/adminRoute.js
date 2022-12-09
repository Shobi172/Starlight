const express = require("express");
const admin_route = express();



const config = require("../config/config");

const adminAuth = require("../middleware/adminAuth").verifyAdmin


const path  = require("path");


const admincontroller = require("../controllers/adminController");


admin_route.get('/',admincontroller.GetLogin);
 
admin_route.post('/login',admincontroller.PostLogin);

admin_route.get('/dashboard', adminAuth,admincontroller.GetDashboard);

admin_route.get('/order',adminAuth,admincontroller.GetOrder);

admin_route.get('/coupon',adminAuth,admincontroller.GetCoupon);

admin_route.get('/banner',adminAuth,admincontroller.GetBanner);

admin_route.get('/users',adminAuth,admincontroller.GetUsers);

admin_route.get('/logout',adminAuth,admincontroller.GetLogout);

admin_route.get('/blockAction/:id',adminAuth,admincontroller.blockUser);

admin_route.get('/unBlockAction/:id',adminAuth,admincontroller.unBlockUser);

admin_route.get('/categories',adminAuth,admincontroller.GetCategory)

admin_route.get('/addcategory',adminAuth,admincontroller.AddCategory)

admin_route.post('/addcategory',adminAuth,admincontroller.PostCategory)

admin_route.get('/editcategory/:id',adminAuth,admincontroller.GetEditCategory)

admin_route.post('/editcategory/:id',adminAuth,admincontroller.PostEditCategory)

admin_route.get('/deletecategory/:id',adminAuth,admincontroller.DeleteCategory);

admin_route.get('/shop/:category',adminAuth,admincontroller.CatProduct);

admin_route.get('/product', adminAuth,admincontroller.GetProduct);

admin_route.get('/addproduct',adminAuth,admincontroller.AddProduct);

admin_route.post('/product',adminAuth,admincontroller.PostProduct);

admin_route.get('/editproduct/:id',adminAuth,admincontroller.GetEditProduct);

admin_route.post('/editproduct/:id',adminAuth,admincontroller.PostEditProduct);

admin_route.post('/productgallery/:id',adminAuth,admincontroller.ProductGallery);

admin_route.get('/deleteproduct/:id',adminAuth,admincontroller.DeleteProduct);







module.exports = admin_route;