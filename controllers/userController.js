const User = require('../models/userModel');
const mongoose = require('mongoose');


const bcrypt = require('bcrypt');

const nodemailer = require("nodemailer");
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Cart = require('../models/cartModel');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');
const Wishlist = require('../models/wishlistModel')
const instance = require('../middleware/razorpay');
const { count } = require('../models/userModel');
const { resolveContent } = require('nodemailer/lib/shared');
const { findOne } = require('../models/adminModel');
const moment = require('moment');







let message;
let name;
let email;
let phone;
let password;



// Bcrypt Password


// const securePassword = async(password)=>{

//     try {

//       const passwordHash = await bcrypt.hash(password, 10);
//       return passwordHash;
        
//     } catch (error) {

//         console.log(error.message);
        
//     }
// }

let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_MAIL,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;




// Get Register


const GetRegister = async(req,res)=>{
  

    try {

        res.render('user/register',{message});
        message= ''
    
    } catch (error) {

        console.log(error);
        
    }
}

 const PostRegister =  async (req, res) => {

    name = req.body.name;
    email = req.body.email;
    phone = req.body.phone;
    password = req.body.password;

    let mailDetails = {
      from: process.env.NODEMAILER_MAIL,
      to: email,
      subject: "STARLIGHT ACCOUNT REGISTRATION",
      html: `<p>YOUR OTP FOR REGISTERING IN STARLIGHT IS ${OTP}</p>`,
    };

    const user = await User.findOne({ email: email });
    if (user) {

        res.render('user/register',{message: 'Already Registered'});
        
      
    } else {
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("Error Occurs");
        } else {
          console.log("Email Sent Successfully");
          res.redirect("/otp");
        }
      });
    }
  }

  // Get Otp 

const GetOtp = async(req,res)=>{
    

    try{
            res.render('user/otp');    


    }catch(error){
        console.log(error.message);
    }
}

  
// Post Otp

const PostOtp = async (req, res) => {
    
    let otp = req.body.otp;
    
    console.log(otp)
    console.log(OTP);
    if (OTP == otp) {
    
        const hash = await bcrypt.hash(password,10);
        const user = new User({
          name: name,
          email: email,
          phone: phone,
          password: hash,
        });

        user.save().then(()=>{
            req.session.user_id = User._id;
            res.redirect('/login')
        })
    } else {
        console.log("otp error");
      res.redirect("/otp");
    }
  }



// Get Login 

const GetLogin = async(req,res)=>{

    if(req.session.user_id){

        res.redirect('/')
    }else{

        try{
                res.render('user/login',{message}); 
                message = ''   

        }catch(error){
            console.log(error.message);
        }
    }
    

}


// Post Login


const PostLogin = async(req,res)=>{
    
    try{
        // console.log( req.body.email)
        // console.log( req.body.password)

        const email = req.body.email;
        const password = req.body.password;
        
    const user=await User.findOne({email:email}).then(async (userData)=>{
        
      if (userData) {

        const passwordMatch = await bcrypt.compare (password,userData.password)

        if(passwordMatch) { 

            req.session.user_id = userData._id;

            
            
            if(userData.status === true){
               
                res.redirect('/');
            } else if (userData.status === false){
                message = "Your Account Has Been Blocked";
                res.redirect('/login');
            }
        

        }
            else{
                message= "password doesn't match"
                res.redirect('/login')
                

            }

    }
    else{
        message="You are not a member? Please Register to continue.."
        res.redirect('/register');

    }

})
console.log(user)
}

    catch(error){
        console.log(error.message);
    }
}


// Get Home 

const GetHome = async(req,res)=>{

    const allproducts = await Product.find()
    const user = req.session.user_id;

    let count = 0;
    let cart = null;

    if(user){

        

        cart = await Cart.findOne({id: user})

    if(cart){
        count = cart.products.length;
    }

    resolveContent(count)
    
    res.render('user/home',{ allproducts,user,cart });
    }
    else
    {
    res.render('user/home',{ allproducts,user:false,cart:false });
    
    }

   
    
}





// Get Shop 

const GetShop = async(req,res)=>{
    
 
    try{

        const allproducts = await Product.find()

        const cat = await Category.find()

       
         res.render('user/shop',{allproducts,cat});    
       

        }
    catch(error){
        console.log(error.message);
    }
}

// Get About 

const GetAbout = async(req,res)=>{
    

    try{
         res.render('user/about');    


    }catch(error){
        console.log(error.message);
    }
}

// Get Contact 

const GetContact = async(req,res)=>{
    

    try{
         res.render('user/contact');    


    }catch(error){
        console.log(error.message);
    }
}
// Get my account 

const GetMyAcct = async(req,res)=>{
    

    try{
         res.render('user/myaccount');    


    }catch(error){
        console.log(error.message);
    }
}


// Get categories

const GetCategories = async(req,res)=>{
    

    try{
        const id = req.params.id;
        

        const cat = await Category.find()
       

        const catproducts = await Category.findOne({_id: id})
         
        if(catproducts){
            Product.find({ category: catproducts._id}).then((allproducts)=>{
                
                res.render('user/shop',{allproducts,cat});
                
            })
        }


            


    }catch(error){

        console.log(error.message);
    }
}



// Get Cart 

const GetCart = async(req,res)=>{

try{

    const uid = req.session.user_id;


    

    Cart.aggregate([
        {
            $match: {user_id: uid},
        },
        {
            $unwind:'$products',
        },
        {
            $project: {
                productitem : '$products.product_id',
                productquantity: '$products.quantity',
            },
        },

        {
            $lookup: {
                from:'products',
                localField:'productitem',
                foreignField:'_id',
                as:'productDetail',
            },
        },

        {
            $project: {
                productitem: 1,
                productquantity: 1,
                productDetail: {$arrayElemAt:['$productDetail',0]},
            },
        },
        {
            $addFields: {
                productPrice: {
                    $sum: {$multiply: ['$productquantity', '$productDetail.price']}
                }
            }
        }
    ]).then((result) =>{
        const sum = result.reduce((accumulator,object) => accumulator + object.productPrice, 0);

        console.log(result);


        

        

        const count = result.length;

        
        
        res.render('user/cart',{allData: result, count, sum, name: req.session.name});
        
        

        
        
    });


}
  catch(error){

        console.log(error.message);
    }
}


const changeproqty = async(req,res)=>{
    try {

        
      const cartid = req.body.cart;
      const pid = req.body.product;
      const count = req.body.count;

      Cart.updateOne(

        { _id: cartid,'products.product_id': pid },

        {
            $inc: { 'products.$.quantity': count },
        },
      ).then((success)=>{

        Cart.findOne({ _id: cartid,'products.product_id': pid }).then((result)=>{

            res.redirect('/cart');

        })
      })

      
        
    } catch (error) {
        
    }
}



// Delete Product from cart

const DeleteCartPdt = async(req,res)=>{
    try {
      const cartid = req.body.cart;
      const pid = req.body.product;
   

      Cart.findOneAndUpdate(
        { _id: cartid},
        {
            $pull: {products : {product_id: pid} }
        }
        
      ).then((success)=>{

            res.redirect('/cart');

        })
      

      
        
    } catch (error) {
        
    }
}





// add cart products 

const GetCartProducts = (req, res) => {
    const pid = req.params.id;
    const uid = req.session.user_id;


    Cart.findOne({ user_id: uid }).then((result) => {
        if (result) {

        Cart.findOne(
                {
                    $and: [{ user_id: req.session.user_id },
                    { products: { $elemMatch: { product_id: pid } } }],
                },
            )
                .then((docs) => {
                    if (!docs) {
                        Cart.findOneAndUpdate(
                            { user_id: uid },
                            { $push: { products: { product_id: pid, quantity: 1 } } },
                        )
                            .then((doc) => {
                                console.log(doc);
                                res.redirect(`/singleshop/${pid}`);
                            });
                    } else {
                        Cart.updateOne(
                            { 'products.product_id': pid },
                            {
                                $inc: { 'products.$.quantity': 1 },
                            },
                        ).then(() => {
                            // console.log(success);
                            res.redirect('/cart');
                        }).catch((er) => {
                            console.log(er);
                        });
                    }
                });
        } else {
            const cart = new Cart({
                user_id: uid,
                products: {
                    product_id: pid,
                    quantity: 1,
                },
            });
            cart.save().then(() => {
                res.redirect('/cart');
            }).catch((e) => {
                console.log(e);
            });
        }
    }).catch((error) => {
        console.log(error);
    });
};








// Get Search 

const GetSearch = async(req,res)=>{
    

    try{

        var search = req.body.search;
        var product_data = await Product.find({"name":{$regex: ".*"+ search +".*",$options:'i'}});  
        if(product_data.length > 0){
           res.render('user/shop',{date: product_data});
        }
    }catch(error){
        console.log(error.message);
    }
}



// Get Thankyou 

const GetThankyou = async(req,res)=>{
    

    try{
         res.render('user/thankyou');    


    }catch(error){
        console.log(error.message);
    }
}



// Get Address 

const GetAddress = async(req,res)=>{

    const userid = req.session.user_id;
    

    try{
         res.render('user/address',{userid});    


    }catch(error){
        console.log(error.message);
    }
}


// Post Address


 const PostAddress =  async (req, res) => {

    try {

        const uid = req.session.user_id;

        

        const userads = new Address({

            user_id: uid,  
            name : req.body.name,
            address : req.body.address,
            state : req.body.state,
            city : req.body.city,
            pincode : req.body.pincode,
       
           });
       
       
           const AdsData = await userads.save();
       
               res.redirect("/checkout");
        
    } catch (error) {

        console.log(error.message);
        
    }
       
}


// Get Checkout 

const GetCheckout = async(req,res)=>{

    try{
            const uid = req.session.user_id;
            // console.log(req.session.user_id)
            Cart.aggregate([
                {
                    $match: { user_id: uid },
                },
                {
                    $unwind: '$products',
                },
                {
                    $project: {
                        productItem: '$products.product_id',
                        productQuantity: '$products.quantity',
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
                    $project: {
                        productItem: 1,
                        productQuantity: 1,
                        productDetail: { $arrayElemAt: ['$productDetail', 0] },
                    },
                },
                {
                    $addFields: {
                        productPrice: {
                            $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
                        },
                    },
                },
            ])
                .exec().then(async (result) => {
                    // console.log("reached result ");
                    const sum = result
                        .reduce((accumulator, object) => accumulator + object.productPrice, 0);
                    const count = result.length;
                   await Address.find({user_id: uid}).then((adrss) => {
                    // console.log(uid);
                        // console.log("adress finding...");
                        // console.log(adrss)
                        res.render('user/checkout', {
                            allData: result, count, sum, name: req.session.name, address: adrss,
                        });
                    }).catch((e) => {
                        console.log(e);
                    });
                });
        
           


    }catch(error){
        console.log(error.message);
    }
}



// confirm order
 
const confirmOrder = (req, res) => {
    const uid = req.session.user_id;
    const paymethod = req.body.pay;
    const adrs = req.body.address;
    // const { Order } = model;

    User.findOne({ user_id: uid }).then((userData) => {
        Cart.aggregate([
            {
                $match: { user_id: uid },
            },
            {
                $unwind: '$products',
            },
            {
                $project: {
                    productItem: '$products.product_id',
                    productQuantity: '$products.quantity',
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
                $project: {
                    productItem: 1,
                    productQuantity: 1,
                    productDetail: { $arrayElemAt: ['$productDetail', 0] },
                },
            },
            {
                $addFields: {
                    productPrice: {
                        $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
                    },
                },
            },
        ])
            .exec().then((result) => {
                
                for (let i = 0; i < result.length; i++) {
                    const csctock = result[i].productDetail.stock - result[i].productQuantity;
                    Product.findByIdAndUpdate(
                       
                        { _id: result[i].productDetail._id },
                        { stock: csctock },
                    ).then(() => {
                    }).catch((erp) => {
                        console.log(erp);
                    });
                }
                
                const sum = result
                    .reduce((accumulator, object) => accumulator + object.productPrice, 0);
                Cart.findOne({ user_id: uid }).then((cartData) => {

                    const order = new Order({
                        order_id: Date.now(),
                        user_id: uid,                       
                        address: adrs,
                        order_placed_on: moment().format('DD-MM-YYYY'),
                        products: cartData.products,
                        totalAmount: sum,
                        paymentMethod: paymethod,
                        expectedDelivery: moment().add(4, 'days').format('MMM Do YY'),
                    });
                   
                    order.save().then((done) => {
                        
                        const oid = done._id;
                        Cart.deleteOne({ user_id: uid }).then(() => {
                            if (paymethod === 'cod') {
                                res.json([{ success: true, oid }]);
                            } else if (paymethod === 'online') {
                                console.log('online');
                                const amount = done.totalAmount * 100;
                                const options = {
                                    amount,
                                    currency: 'INR',
                                    receipt: `${oid}`,
                                };
                                instance.orders.create(options, (err, orders) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json([{ success: false, orders }]);
                                    }
                                });
                            }
                        });
                    });
                });
            });
    });
};



// order success page

const orderSuccess = (req, res) => {
    console.log(req.params);
    const oid = mongoose.Types.ObjectId(req.params.oid);
    Order.aggregate([
        { $match: { _id: oid } },
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
        console.log(result);
        console.log('order_id');
        res.render('user/orderSuccess', {
            id: result[0].order_id,
            amount: result[0].totalAmount,
            deladd: result[0].address[0],
            count: result[0].products.length,
            // name: result[0].user[0].name,
        });
    });
};

// order history

const orderHistory = (req, res) => {
    // const name = req.session.name;
    const uid = req.session.user_id;
    console.log(uid);
    // console.log(name);
    Order.aggregate([
        {
            $match: { user_id: uid },
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
        // console.log(result);
       
        Order.find({ user_id: '638adce7c82d1d6532908d45' }).then((doc) => {
            
            res.render('user/orderhistory', {
                name, count: 0, productData: result, allData: doc, items: 0,
            });
        });
    });
};    



const verifyPayment = (req, res) => {
    
    const details = req.body;
    let hmac = crypto.createHmac('sha256', 'uYglaEyoaZ1j8MXmPiCDHfZi');
    hmac.update(
       
        details.payment.razorpay_order_id +
        
        '|' +
        
        details.payment.razorpay_payment_id
    );
    hmac = hmac.digest('hex');
    
    if (hmac == details.payment.razorpay_signature) {
        const objId = mongoose.Types.ObjectId(details.order.receipt);
        console.log(objId);
        model.Order
            .updateOne({ _id: objId }, { $set: { paymentStatus: 'Paid' } })
            .then(() => {
                res.json({ success: true, oid: details.order.receipt });
            })
            .catch((err) => {
                console.log(err);
                res.json({ status: false, err_message: 'payment failed' });
            });
    } else {
        res.json({ status: false, err_message: 'payment failed' });
    }
};




const paymentFailure = (req, res) => {
    const details = req.body;
    console.log(details);
    res.send('payment failed');
};



// Get Wishlist 
 

const GetWishlist = async(req,res)=>{

    try{
    
        const uid = req.session.user_id;
    
    
        
    
        const wishlistData = await Wishlist.aggregate([
            {
                
                $match: { userId: uid },
            },
            {
                $unwind: '$product',
            },
            {
                $project: {
                    productItem: '$product.productId',
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
                $project: {
                    productItem: 1,
                    productDetail: { $arrayElemAt: ['$productDetail', 0] },
                },
            },
        ]);
        res.render(
            'user/wishlist',
            {
                name: req.session.name,
                
                wishlistData,
                
            },
    
    
    )}
      catch(error){
    
            console.log(error.message);
        }
    }
    
    // Add to wishlist

    const AddWishlistProducts = (req, res) => {
        const uid = req.session.user_id;
        const { pid } = req.body;
        const proObj = {
            productId: pid,
        };
        const userWishlist = Wishlist.findOne({ userId: uid });
        const verify = Cart.findOne(
            { user_id: uid },
            { product: { $elemMatch: { productId: pid } } },
        );
        if (verify?.products?.length) {
            res.json({ cart: true });
        } else {
            
            if (userWishlist) {
                const proExist = userWishlist.product.findIndex(
                    (product) => product.productId === pid,
                );
                if (proExist !== -1) {
                    res.json({ productExist: true });
                } else {
                    Wishlist
                        .updateOne({ userId: uid }, { $push: { product: proObj } })
                        .then(() => {
                            res.json({ success: true });
                        });
                }
            } else {
                Wishlist
                    .create({
                        userId: uid,
                        product: [
                            {
                                productId: pid,
                            },
                        ],
                    })
                    .then(() => {
                        res.json({ status: true });
                    });
            }
        }
}
  


// Get Singleshop 

const GetSingleshop = async(req,res)=>{
    

    try{
        const allproducts = await Product.find()

        if (req.session.user_id) {


        const id = req.params.id;


        const singleview = await Product.find({_id: id})

         res.render('user/singleshop',{singleview,allproducts});

            
        }

            

    }catch(error){
        res.render('user/404');
    }
}



// Get Logout 

const GetLogout = async(req,res)=>{
    

    try{

         req.session.user_id = null;
         req.session.destroy();
         res.redirect('/');   


    }catch(error){
        console.log(error.message);
    }
}


  

module.exports = {
    GetRegister,
    PostRegister,
    GetOtp,
    PostOtp,
    GetLogin,
    PostLogin,
    GetHome,
    GetAbout,
    GetCart,
    GetCheckout,
    GetContact,
    GetShop,
    GetSingleshop,
    GetThankyou,
    GetLogout,
    GetCartProducts,
    changeproqty,
    DeleteCartPdt,
    GetMyAcct,
    GetCategories,
    GetAddress,
    PostAddress,
    confirmOrder,
    GetWishlist,
    GetSearch,
    orderSuccess,
    orderHistory,
    verifyPayment,
    paymentFailure,
    AddWishlistProducts
    
}
