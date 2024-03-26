//importing the required packages from node modules
require("dotenv").config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session=require("express-session");
const bcrypt=require("bcrypt");
const MongoStore = require('connect-mongo');
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
//const MongoStore = require('connect-mongo');
app.set('view engine', 'ejs'); //setting the view engine to ejs
require("./middleware/session");
//server database connection string linking
app.use(passport.initialize());
//used to configure the module to parse incoming request bodies in the url encoded format
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use("/query_page" ,express.static("public"))
app.use("/my_queries" ,express.static("public"))
app.use(session({
  secret: process.env.SECRET1,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 // 1 hour in milliseconds
  },
  store: MongoStore.create({ mongoUrl: "mongodb+srv://mittaludit768:" + process.env.MONGO_P + "@hostelmanagement.iky6mce.mongodb.net/?retryWrites=true&w=majority&appName=HostelManagement" })
})); //making a session for sign in through express-session
//user schema for storingg user signup details in database
app.use(session({
  secret: process.env.SECRET2,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 // 1 hour in milliseconds
  },
  store: MongoStore.create({ mongoUrl: "mongodb+srv://mittaludit768:" + process.env.MONGO_P + "@hostelmanagement.iky6mce.mongodb.net/?retryWrites=true&w=majority&appName=HostelManagement" })
}));
const sessionStore = MongoStore.create({ mongoUrl: "mongodb+srv://mittaludit768:" + process.env.MONGO_P + "@hostelmanagement.iky6mce.mongodb.net/?retryWrites=true&w=majority&appName=HostelManagement" });
const {requireAuthenticate,requireAuthenticate1}=require("./middleware/authentication");
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/userRoutes'));


app.delete('/delete-post/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
      // Find the post by ID
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ error: 'Post not found.' });
      }

      // Delete the post
      await Post.findByIdAndDelete(postId);
     
      res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
   
      console.error('Error deleting post:', error);
      // Send response with error message
      res.status(500).json({ error: 'An error occurred while deleting the post.' });
  }
});

const PORT=process.env.PORT||3000;
app.use('/', require('./routes/postRoutes'));
app.listen(3000, function() { 

    console.log("Server started on port 3000");
});
module.exports=sessionStore;
