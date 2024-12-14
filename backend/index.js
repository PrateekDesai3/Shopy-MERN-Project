const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect(
  "mongodb+srv://your-key",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Database connection error:", error));

// API creation
app.get("/", (req, res) => {
  res.send("Express running");
});

// Image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Serve static images
app.use('/images', express.static('upload/images'));

// Upload route
app.post("/upload", upload.single('product'), (req, res) => {

  if (req.file) {
    res.json({
      success: 1,
      image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
  } else {
    res.status(400).json({ success: 0, message: "File not uploaded" });
  }
});

//schema
const Product=mongoose.model("product",{
    id:
    {
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true, 
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },

})
//user schema
const Users  = mongoose.model('Users',{
     name:{
      type:String,
     },
     email:{
      type:String,
      unique:true,
     },
     password:{
      type:String,
     },
     cartData:{
      type:Object,
     },
     date:{
      type:Date,
      default:Date.now,
     }
})

//create resgister api

app.post('/signup',async (req,res)=>{
   let check = await Users.findOne({email:req.body.email});

   if(check){
    return res.status(400).json({success:false,errors:"Existing user found! "})
   }
   let cart ={};

   for (let i = 0; i < 300; i++) {
    cart[i]=0;
    }

    const user = new Users({
      name:req.body.username,
      email:req.body.email,
      password:req.body.password,
      cartData:cart,
    })

    await user.save();

    const data = {
      user:{
        id:user.id
      }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//login api

app.post('/login',async (req,res)=>{
  let user = await Users.findOne({email:req.body.email});
  if(user){
    const passCompare = req.body.password === user.password;
    if(passCompare){
      const data ={
        user:{
          id:user.id
        }
      }
      const token = jwt.sign(data,'secret_ecom');
      res.json({success:true,token});
    }
    else{
      res.json({success:false,errors:"Wrong Password"})
    }
  }
  else{
    res.json({success:false,errors:"Wrong Email id"})
  }
})


app.post('/addproduct',async(req,res)=>{
    let products=await Product.find({});
    let id;
    if(products.length>0){
       let last_product_array = products.slice(-1);
       let last_product=last_product_array[0]; 
       id=last_product.id+1;  
    }
    else{
        id=1;
    }
    const product =new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();

    console.log("Saved");

    res.json({
        success:true,
        name:req.body.name,
    })
})
//Creatiing Delete API

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed!");
    res.json({
        success:true,
        name:req.body.name
    })
})
//Creating API for getting all products
app.get('/allproducts',async(req,res)=>{
    let products =await Product.find({});
    console.log("All produccts fetched");
    res.send(products)
})
//newcollection api
app.get('/newcollections',async (req,res)=>{
  let products= await Product.find({});
  //recently added 8 products
  let newcollection = products.slice(1).slice(-8);
  console.log("NEW COLLWCTION FETCHED");
  res.send(newcollection);

})
//popular api
app.get('/popularinwomen',async(req,res)=>{
    let products= await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    console.log("POPULAR IN WOMEN");
    res.send(popular_in_women);
})
//creating middleware to get user
const fetchUser=async(req,res,next) => {
    const token=req.header('auth-token');
    if(!token){
      res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
      try {
        const data = jwt.verify(token,'secret_ecom');
        req.user=data.user;
        next();
      } catch (error) {
        res.status(401).send({errors:"Please authenticate"})
      }
    }
}
//addtocart api
app.post('/addtocart',fetchUser,async(req,res)=>{
  console.log("added",req.body.itemId);
  let userData= await Users.findOne({_id:req.user.id});
  userData.cartData[req.body.itemId]+=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Added")
 
})
//removefromcart api
app.post('/removefromcart',fetchUser,async(req,res)=>{
  console.log("removed",req.body.itemId);
  let userData= await Users.findOne({_id:req.user.id});
  if(userData.cartData[req.body.itemId]>0)
  userData.cartData[req.body.itemId]-=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Removed")
})

//getcartitem
app.post('/getcart',fetchUser,async(req,res)=>{
  console.log("get cart");
  let userData=await Users.findOne({_id:req.user.id});
  res.json(userData.cartData)
})


// Start server
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server running on http://localhost:${port}`);
  } else {
    console.log("Server error:", error);
  }
});
