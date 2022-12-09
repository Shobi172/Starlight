const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

const bcrypt = require("bcrypt");
const { name } = require("ejs");
const { Result } = require("express-validator");

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
  try {
    res.render("admin/order");
  } catch (error) {
    console.log(error.message);
  }
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
  if (req.session.admin_id) {
    const newProduct = new Product(req.body);
    await newProduct.save();
    let image = req.files.image;
    image.mv(
      "./public/products/img/" + newProduct._id + ".jpg",
      (err, data) => {
        if (!err) {
          console.log(newProduct);
          res.redirect("/admin/product");
        } else {
          console.log(err);
        }
      }
    );
  } else {
    res.redirect("/admin/login");
  }
};

const GetEditProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  const categories = await Category.find({});

  res.render("admin/editproduct", { product, categories });
};

const PostEditProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndUpdate(id, req.body);

    res.redirect("/admin/product");

    if (req.session.admin_id) {
      let image = req.files.image;
      image.mv("./public/products/img/" + id + ".jpg");
    }
  } catch (error) {
    console.log(error);
  }
};

const DeleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    await Product.findOneAndDelete({ _id: id });

    res.redirect("/admin/product");
  } catch (error) {
    console.log(err);
  }
};

const ProductGallery = async (req, res) => {
  try {
    const id = req.params.id;
    const thumbPath =
      "public/products/img/" + id + "/gallery/thumbs" + req.files.file.name;

    if (req.session.admin_id) {
      let image = req.files.image;

      image.mv("public/products/img/" + id + "/gallery/" + req.files.file.name);
    }
  } catch (error) {
    console.log(error.message);
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
  ProductGallery,
  CatProduct,
};
