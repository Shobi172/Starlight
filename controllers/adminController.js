const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const upload = require("../middleware/imageUpload");
const multer = require("multer");
const sharp = require("sharp");


const bcrypt = require("bcrypt");
const { name } = require("ejs");
const { Result } = require("express-validator");

const { log } = require("console");


const fs = require('fs');
const moment = require('moment');



// Get Login

const GetLogin = async (req, res) => {
  try {
    res.render("admin/login");
  } catch (error) {
    console.log(error.message);
  }
};

// Post Login

const PostLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    // console.log(email);
    // console.log(password);
    const adminData = await Admin.findOne({ email: email });
    // console.log(adminData);

    if (adminData) {
      if (adminData.password == password) {
        req.session.admin_id = adminData._id;
        res.redirect("/admin/dashboard");
        // console.log(req.session.admin);
      } else {
        res.redirect("/admin/login");
      }
    } else {
      res.render("admin/login", { message: "Invalid login detials" });
    }
  } catch (error) {
    console.log(error.message);
  }
};



// Get Dashboard

const GetDashboard = async (req, res) => {
  try {
    res.render("admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};



// Get Order

const GetOrder = async (req, res) => {
  Order.aggregate([

    {
      $lookup: {
          from: 'products',
          localField: 'products.product_id',
          foreignField: '_id',
          as: 'product',
      },
  },
    {
        $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: 'user_id',
            as: 'user',
        },
    },
    {
        $lookup: {
            from: 'addresses',
            localField: 'address',
            foreignField: '_id',
            as: 'address',
        },
    },
]).then((result) => {
    
    res.render('admin/order', {allData: result});
});
};



const OrderStatus = (req, res) => {
  const { orderID, paymentStatus, orderStatus } = req.body;


  console.log(req.body);

  console.log({orderid :orderID});

 
  Order.findByIdAndUpdate(
      { _id: orderID },
      {
          paymentStatus, orderStatus
      },
  ).then((result) => {

    console.log('Order status changed');
      
      res.send('Working');
  }).catch((e) => {
      console.log(e);
  });
};



const OrderCompleted = (req, res) => {
  const { orderID } = req.body;
  Order.findByIdAndUpdate(
      { _id: orderID },
      { orderStatus: 'Completed' },
  ).then(() => {
      res.send('done');
  });
};

const OrderCancelled = (req, res) => {
  const { orderID } = req.body;
  Order.findByIdAndUpdate(
      { _id: orderID },
      { orderStatus: 'Cancelled', paymentStatus: 'Cancelled' },
  ).then(() => {
      res.send('done');
  });
};


// Get Coupon

const GetCoupon = async (req, res) => {
  try {
    res.render("admin/coupon");
  } catch (error) {
    console.log(error.message);
  }
};

// Get Banner

const GetBanner = async (req, res) => {
  try {
    res.render("admin/banner");
  } catch (error) {
    console.log(error.message);
  }
};

// Get Users

const GetUsers = async (req, res) => {
  try {
    const userData = await User.find();

    res.render("admin/users", { users: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const blockUser = async (req, res) => {
  // console.log("Set");
  const id = req.params.id;
  // console.log(id);
  try {
    const block = await User.findByIdAndUpdate(id, { status: false });
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error);
  }
};

const unBlockUser = async (req, res) => {
  // console.log("Set");
  const id = req.params.id;
  // console.log(id);
  try {
    const unBlock = await User.findByIdAndUpdate(id, { status: true });
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error);
  }
};

// Get Logout

const GetLogout = async (req, res) => {
  try {
    if (req.session.admin_id) {
      req.session.admin_id = null;
      req.session.destroy();

      res.render("admin/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Get category

const GetCategory = async (req, res) => {
  if (req.session.admin_id) {
    const cat = await Category.find({});

    res.render("admin/categories", { cat });
  }
};

// Add Category

const AddCategory = async (req, res) => {
  res.render("admin/addcategory");
};

// Post Category

const PostCategory = async (req, res) => {
  try {
    if (req.session.admin_id) {
      const newCategory = new Category(req.body);
      await newCategory.save();

      res.redirect("/admin/categories");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const GetEditCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const categories = await Category.findById(id);
    console.log(categories);
    res.render("admin/editcategory", { categories });
  } catch (error) {
    console.log(error.message);
  }
};

const PostEditCategory = async (req, res) => {
  try {
    const id = req.params.id;
    //await Category.findByIdAndUpdate(id, req.body);
    await Category.updateOne({_id:id},{$set:{name:req.body.category}})
    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error.message);
  }
};

const DeleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    await Category.findByIdAndDelete({ _id: id });

    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error.message);
  }
};

// products

const GetProduct = async (req, res) => {
  if (req.session.admin_id) {
    const allproducts = await Product.find().populate('category');

    

    res.render("admin/product", { allproducts });
  } else {
    res.redirect("/admin/login");
  }
};

const AddProduct = async (req, res) => {
  if (req.session.admin_id) {
    const categories = await Category.find({});
    res.render("admin/addproduct", { categories });
  } else {
    res.redirect("/admin/login");
  }
};



const PostProduct = async (req, res) => {

  try{
    
      const newProduct = new Product({

        name:req.body.name,
        category:req.body.category,
        quantity:req.body.quantity,
        stock:req.body.stock,
        price:req.body.price,
        description:req.body.description,
      });

      

      newProduct.image = req.files.map((f)=>({url:f.path, filename:f.filename}));

      

     

       const productitm = await newProduct.save();
      
            // console.log(newProduct);
            res.redirect("/admin/product");

  }catch(error){
    console.log((error.message));
  }
  
};

// Get editproduct


const GetEditProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({_id:id}).populate('category');
  const categories = await Category.find();

  res.render("admin/editproduct", {product, categories });
};



// post editproduct

const PostEditProduct = async (req, res) => {
  
  const id = req.params.id;

  if(req.files.length>0){
    const photos = req.files.map((f)=>({
      url:f.path,
      filename: f.filename,
     }));
     let product = await Product.updateOne({_id:id},{image:photos})
  }

    try {
      await Product.updateOne({ _id: id },
        {
            $set: 
                req.body
        })
      
    res.redirect("/admin/product");

  } catch (error) {
    console.log(error);
  }
};


// delete product

const DeleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    await Product.findOneAndDelete({ _id: id });

    res.redirect("/admin/product");
  } catch (error) {
    console.log(err);
  }
};



// display product by category

const CatProduct = async (req, res) => {
  try {
    const categorypro = req.params.category;

    const c = Category.findOne({ name: categorypro });
    const products = Product.find({ category: categorypro });

    res.render("admin/product", { name: c.name, products: products });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  GetBanner,
  GetCoupon,
  GetDashboard,
  GetLogin,
  GetLogout,
  GetOrder,
  GetUsers,
  PostLogin,
  blockUser,
  unBlockUser,
  AddCategory,
  AddProduct,
  PostProduct,
  GetProduct,
  PostCategory,
  GetCategory,
  DeleteCategory,
  DeleteProduct,
  GetEditCategory,
  PostEditCategory,
  GetEditProduct,
  PostEditProduct,
  CatProduct,
  OrderStatus,
  OrderCompleted,
  OrderCancelled
};
