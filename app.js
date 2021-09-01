require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const User = require("./model/user");
const Product = require("./model/product");
const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

app.get("/getProduct", auth, async(req, res) => {
  const userId = req.user;
  const responseData ={};
  responseData.Status = 'Pending';
  const userProduct = await Product.find(mongoose.Types.ObjectId(userId), { _id : 0,__v : 0,userId :0 });  

  if(userProduct.length){
    responseData.Status = true;
    responseData.Response = userProduct;
  }else{
    responseData.Status = false;
    responseData.Response = {"errorCode":"EW-1"};
  }
  res.status(200).json(responseData);
});

app.post("/addNew", auth, async(req, res) => {
  try {
    const { product, location} = req.body;
    if (!(location && product)) {
      res.status(400).send("All input is required");
    }else{
      // const currentUser = await User.findOne({"id":req.user});
      userId = mongoose.Types.ObjectId(req.user); 
      const newProduct = await Product.create({
        product,
        location,
        userId,
      }); 
      
      res.status(200).json(newProduct);
    }
  }
  catch(err) {
    console.log(err);
  } 
});


// Logic goes here
app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { first_name, last_name, email, password } = req.body;
  
      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // encryptedPassword = password;
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  

  app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }else{
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }else{
        res.status(400).send("Invalid Credentials");
        }
    }
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  // ...

module.exports = app;