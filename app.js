//importing the required packages from node modules
require("dotenv").config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session=require("express-session");
const bcrypt=require("bcrypt");
const passport=require("passport");
const User=require("./models/User");
require("./utilities/passport-setup");
const saltRounds=10; //saltRounds for unique hash for each password even if repeated
const app = express();
const crypto=require("crypto");
// const date=require(__dirname+"/date.js");
const nodemailer = require('nodemailer');
const mongoose=require("mongoose");
var token="";
const connectToDatabase=require("./config/db");
connectToDatabase();
const Contact=require("./models/Contact");
const Post=require("./models/Post");
const Vote=require("./models/Vote");
const {Admin,admin}=require("./models/Admin");
const {getToken}=require("./utilities/help");
const cors = require('cors');
app.use(cors());
app.use(express.json()); // This is required to parse JSON bodies
const posts=[];
var postId;
var userId;
const Schema = mongoose.Schema;
app.set('view engine', 'ejs'); //setting the view engine to ejs
//server database connection string linking
app.use(passport.initialize());
//used to configure the module to parse incoming request bodies in the url encoded format
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use("/query_page",express.static("public"))
app.use(session({
  secret: process.env.SECRET1,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 // 1 hour in milliseconds
  }
})); //making a session for sign in through express-session
//user schema for storingg user signup details in database
app.use(session({
  secret: process.env.SECRET2,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 // 1 hour in milliseconds
  }
}));
const {requireAuthenticate,requireAuthenticate1}=require("./middleware/authentication");
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/userRoutes'));
app.use('/', require('./routes/postRoutes'));
app.listen(3000, function() { //generating server at port 3000
    console.log("Server started on port 3000");
});

