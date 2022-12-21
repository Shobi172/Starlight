const express = require("express");
const admin_route = express();


const config = require("../config/config");

const adminAuth = require("../middleware/adminAuth").verifyAdmin

const multer = require("multer");

const {storage} = require("../middleware/imageUpload");

const upload = multer({storage});

const admincontroller = require("../controllers/adminController");


// Login And Dashboard

admin_route.get('/',admincontroller.GetLogin);
 
admin_route.post('/login',admincontroller.PostLogin);

admin_route.get('/dashboard', adminAuth,admincontroller.GetDashboard);


// Order Secion

admin_route.get('/order',adminAuth,admincontroller.GetOrder);

admin_route.post('/changestatus',adminAuth,admincontroller.OrderStatus);

admin_route.post('/ordercompleted',adminAuth,admincontroller.OrderCompleted);

admin_route.post('/ordercancel',adminAuth,admincontroller.OrderCancelled);


// Coupon Section

admin_route.get('/coupon',adminAuth,admincontroller.GetCoupon);


// Banner Section

// admin_route.get('/banner',adminAuth,admincontroller.Getbanner);

// admin_route.get('/addbanner',adminAuth,admincontroller.addbanner);

// admin_route.post('/addbanner',upload.single('image'),adminAuth,admincontroller.addbannerpost);

// admin_route.get('/deletebanner/:id',adminAuth,admincontroller.deletebanner);


// Sales Report

admin_route.get('/salesreport',adminAuth,admincontroller.GetSalesreport);


// Users Section

admin_route.get('/users',adminAuth,admincontroller.GetUsers);

admin_route.get('/blockAction/:id',adminAuth,admincontroller.blockUser);

admin_route.get('/unBlockAction/:id',adminAuth,admincontroller.unBlockUser);


// Category Section

admin_route.get('/categories',adminAuth,admincontroller.GetCategory)

admin_route.get('/addcategory',adminAuth,admincontroller.AddCategory)

admin_route.post('/addcategory',adminAuth,admincontroller.PostCategory)

admin_route.get('/editcategory/:id',adminAuth,admincontroller.GetEditCategory)

admin_route.post('/editcategory/:id',adminAuth,admincontroller.PostEditCategory)

admin_route.get('/deletecategory/:id',adminAuth,admincontroller.DeleteCategory);

admin_route.get('/shop/:category',adminAuth,admincontroller.CatProduct);



// Product Section

admin_route.get('/product', adminAuth,admincontroller.GetProduct);

admin_route.get('/addproduct',adminAuth,admincontroller.AddProduct);

admin_route.post('/product',upload.array('image',5),adminAuth,admincontroller.PostProduct);

admin_route.get('/editproduct/:id',adminAuth,admincontroller.GetEditProduct);

admin_route.post('/editproduct/:id',upload.array('image',5),adminAuth,admincontroller.PostEditProduct);

admin_route.get('/deleteproduct/:id',adminAuth,admincontroller.DeleteProduct);


// Logout

admin_route.get('/logout',adminAuth,admincontroller.GetLogout);







module.exports = admin_route;