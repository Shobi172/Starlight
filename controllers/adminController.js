const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel")
const upload = require("../middleware/imageUpload");
const multer = require("multer");
const sharp = require("sharp");

const mongoose = require('mongoose');


const bcrypt = require("bcrypt");
const { name } = require("ejs");
const { Result } = require("express-validator");

const { log } = require("console");


const fs = require('fs');
const moment = require('moment');
const Banner = require("../models/bannerModel");




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
console.log('i got post')

    const Email="admin@gmail.com";
    const Password= '000'

    console.log(req.body.email + "and"+req.body.password)
    const email = req.body.email;
    const password = req.body.password;

      if(email == Email && password == Password){
       
        req.session.admin_id = req.body.email;
        res.redirect("/admin/dashboard");
      }else{
        console.log('OOPS FAILED')
        res.render("admin/login", { message: "Invalid login detials" });
      }

    // console.log(email);
    // console.log(password);
    // const adminData = await Admin.findOne({ email: email });
    // console.log(adminData);

    // if (adminData) {
    //   if (adminData.password == password) {
    //     req.session.admin_id = adminData._id;
    //     res.redirect("/admin/dashboard");
    //     // console.log(req.session.admin);
    //   } else {
    //     res.redirect("/admin/login");
    //   }
    // } else {
    //   res.render("admin/login", { message: "Invalid login detials" });
    // }




  } catch (error) {
    console.log(error.message);
  }
};



// Get Dashboard

const GetDashboard = async (req, res) => {

  try {
        const userCount = await User.countDocuments({});
        const productCount = await Product.countDocuments({});
        const orderData = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
        const orderCount = await Order.countDocuments({});
        const pendingOrder = await Order.find({ orderStatus: 'Pending' }).count();
        const completed = await Order.find({ orderStatus: 'Completed' }).count();
        const delivered = await Order.find({ orderStatus: 'Delivered' }).count();
        const cancelled = await Order.find({ orderStatus: 'Cancelled' }).count();
        const cod = await Order.find({ paymentMethod: 'cod' }).count();
        const online = await Order.find({ paymentMethod: 'Online' }).count();
        const totalAmount = orderData.reduce((accumulator, object) => {
            
            return (accumulator += object.totalAmount);
        }, 0);

        // const allCategories = await Category.find({})
        // const allOrders = await Order.find({})
        // console.log(allOrders[0])
        // allCategories.forEach((item)=>{
        //   Order.countDocuments({})

        //   item._id
        // })

        // console.log(allCategories )
        res.render("admin/dashboard", {
            usercount: userCount,
            productcount: productCount,
            totalamount: totalAmount,
            ordercount: orderCount,
            pending: pendingOrder,
            completed,
            delivered,
            cancelled,
            cod,
            online,
        });

   
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
  console.log("hiiiii")

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
      
            console.log("newProduct");
            res.redirect(303, "/admin/product");

  }catch(error){
    console.log(error);
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


// sales report

const GetSalesreport = async (req, res) => {
  try {
      
      const monthstart = moment().startOf('month');
      const monthend = moment().endOf('month');
      
      const monthReport = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: monthstart.toDate(),
                    $lte: monthend.toDate(),
                },
            },
        },
        {
            $lookup:
            {
                from: 'users',
                localField: 'user_id',
                foreignField: 'user_id',
                as: 'user',
            },
        },
        {
            $project: {
                order_id: 1,
                user: 1,
                paymentStatus: 1,
                totalAmount: 1,
                orderStatus: 1,
            },
        },
    ]);
    res.render('admin/salesreport', { month: monthReport });
  }
  catch (error) {
    console.log(error.message);
}
};

// const Getbanner = (req,res) => {
//   try {

//     const banner = Banner.find();
//     res.render('admin/banner',{allData : banner});
    
//   } catch (error) {

//     console.log(error.message);
    
//   }
// }

// const addbanner = (req,res) => {
//   try {

//     res.render('admin/addbanner');
    
//   } catch (error) {

//     console.log(error.message);
    
//   }
// }

// const addbannerpost = async (req,res) => {
//   try {

//     const banner = new Banner({

//       Heading: req.body.head,
//       Subheading: req.body.subhead,
//     });

//     banner.image = req.files.map((f)=>({url:f.path, filename:f.filename}))

//     const banneritm = await banner.save();

//     res.render('admin/banner');
    
//   } catch (error) {

//     console.log(error.message);
    
//   }
// }

// const deletebanner = (req, res) => {
 
//     try {
//       const id = req.params.id;
  
//        Product.findOneAndDelete({ _id: id });
  
//       res.redirect("/admin/banner");
//     } catch (error) {
//       console.log(err);
//     }
// };

// Get Coupon

const GetCoupon = async (req, res) => {
  try {

    const coupons = await Coupon.find();
    // console.log(coupons);
    
    res.render("admin/coupon",{allData: coupons});
    
    
  } catch (error) {
    console.log(error.message);
  }
};


// Add Coupon

const AddCoupon = async (req, res) => {
  try {

    res.render("admin/addcoupon");
  } catch (error) {
    console.log(error.message);
  }
};

// Add Coupon  Post

const AddCouponPost = async (req, res) => {
  try {

    const {code, offer, amount} = req.body;

    const alreadyexist = Coupon.find({coupon_code: code});
    if ((await alreadyexist).length != 0) {

      res.redirect("/admin/addcoupon");
      
    }else{

      const coupon = new Coupon({
        coupon_code: code,
        offer,
        max_amount: amount,
      });
      await coupon.save();
    }

    res.redirect("/admin/coupon");
  } catch (error) {
    console.log(error.message);
  }
};

// Deactivate Coupon

const DeactivateCoupon = async(req,res) => {
  try {

  //   let id=req.params.id;
  // let cid= mongoose.Types.ObjectId(id)
  // console.log(cid)

   await Coupon.findByIdAndUpdate({_id: req.params.id},{coupon_status: Deactive});

    res.redirect('/admin/coupon');

    
  } catch (error) {

    console.log('error');
    
  }
}

// Activate Coupon

const ActivateCoupon = async(req,res) => {
  try {

  //   let id=req.params.id;
  // let cid= mongoose.Types.ObjectId(id)
  // console.log(cid)

    await Coupon.findByIdAndUpdate({_id: req.params.id},{coupon_status: Active});

    res.redirect('/admin/coupon');

    
  } catch (error) {

    console.log('error');
    
  }
}

// Delete Coupon

const DeleteCoupon = async(req,res) => {
  try {
let id=req.params.id;
  let cid= mongoose.Types.ObjectId(id)
  console.log(cid)


    const deleteCoupon= await Coupon.findByIdAndDelete({_id:cid});

    res.redirect('/admin/coupon');

    
  } catch (error) {

    console.log(error);
    
  }
}


// Edit Coupon

const EditCoupon = async(req,res) => {
  try {

    let id=req.params.id;
  let cid= mongoose.Types.ObjectId(id)

  console.log(cid);

    const editcoupon  = await Coupon.findOne({_id: id}).then((doc)=>{

      res.render('admin/coupon',{allData: doc});

    });
 
  } catch (error) {

    console.log('error.message');
    
  }
}


// Post Edit Coupon

const PostEditCoupon = async(req,res) => {
  try {

    const {id,code,offer,amount} = req.body;

    await Coupon.findByIdAndUpdate({_id: id},{coupon_code: code, offer, max_amount: amount});

    res.redirect('/admin/coupon');

    
  } catch (error) {

    console.log('error.message');
    
  }
}


// Order Products


const OrderProducts = (async(req,res)=>{
  console.log("jhhjh");

  console.log(req.params.oid);

  const oid = mongoose.Types.ObjectId(req.params.oid);     
  console.log(oid);

  const getAddress=await Order.aggregate([
      {$match:{_id:oid}},
      {$unwind:"$address"},
      {$project:{
         address :"$address"
      }},
      {$lookup:{
          from:"addresses",
          localField:"address",
          foreignField:"_id",
          as:"Address"
      }},
      {$unwind:"$Address"},
      
  ])

  // console.log("shobin")
  // console.log(getAddress)
  // console.log("-----------------------------------------")
const address=await Order.aggregate([

      {
          $match:{_id:oid}
      },
      {
          $unwind: '$products',
      },
      {
          $project: {
              productItem: '$products.product_id',
              productQuantity: '$products.quantity',
              order_id: 1,
              address: 1,
              expectedDelivery: 1,
              totalAmount: 1,
              paymentMethod: 1,
              paymentStatus: 1,
              orderStatus: 1,
              createdAt: 1,
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
      {
          $lookup: {
              from: 'products',
              localField: 'productItem',
              foreignField: '_id',
              as: 'productDetail',
          },
      },
      {
          $unwind: '$productDetail',
      },
      {
          $addFields: {
              productPrice: {
                  $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
              },
          },
      },
      
  ]).then((result) => {

                  // let dis = 0;
                  // let tamount = 0;
                  // const coupon = Coupon.findOne({ coupon_code: req.body.coupon });
                  // const sum = result
                  //     .reduce((accumulator, object) => accumulator + object.productPrice, 0);
                  // if (coupon) {
                  //     dis = (Number(sum) * Number(coupon.offer)) / 100;
                  //     if (dis > Number(coupon.max_amount)) {
                  //         dis = Number(coupon.max_amount);
                  //     }
                  //     tamount = sum - dis;
                  // } else {
                  //     tamount = sum;
                  // }

                  // console.log(result);

             
      
      
          
          res.render('admin/orderss', {
              name, count: 0, productData: result, items: 0,getAddress
          });
      
  });


  
})











module.exports = {
  // Getbanner,
  GetCoupon,
  GetDashboard,
  GetLogin,
  GetLogout,
  GetOrder,
  GetUsers,
  GetSalesreport,
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
  OrderCancelled,
  OrderProducts,
  AddCoupon,
  AddCouponPost,
  DeactivateCoupon,
  ActivateCoupon,
  DeleteCoupon,
  EditCoupon,
  PostEditCoupon

  // addbanner,
  // addbannerpost,
  // deletebanner
};
