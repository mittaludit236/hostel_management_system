//importing the required packages from node modules
require("dotenv").config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session=require("express-session");
const bcrypt=require("bcrypt");
const saltRounds=10; //saltRounds for unique hash for each password even if repeated
const http=require("http");
const app = express();
const crypto=require("crypto");
const date=require(__dirname+"/date.js");
const nodemailer = require('nodemailer');
const _=require("lodash");
const mongoose=require("mongoose");
var token="";
const posts=[];
var ema;
var nm;
var postId;
var userId;
const Schema = mongoose.Schema;
app.set('view engine', 'ejs'); //setting the view engine to ejs
//server database connection string linking
mongoose.connect("mongodb+srv://mittaludit236:12345@cluster0.bqkcjhs.mongodb.net/?retryWrites=true&w=majority",{ useNewUrlParser: true }); 
//mongoose.set("useCreateIndex",true);
//used to configure the module to parse incoming request bodies in the url encoded format
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
  secret: 'hello myyy',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 // 1 hour in milliseconds
  }
})); //making a session for sign in through express-session
//user schema for storingg user signup details in database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  retype: {
    type: String,
    required: true
  }
});
//authentication function for finding whether the user is logged in or not
function requireAuthenticate(req,res,next){
  if(req.session && req.session.userId)
  next();
  else
  res.redirect("/signin_student");
}
// function requireAuthenticate1(req,res,next){
//   if(req.session && req.session.userId)
//   next();
//   else
//   res.redirect("/signin_admin");
// }
//contact Schema for storing contact details
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  PhoneNumber: {
    type: String,
    required: true
  },
  message: {
    type: String
  }
});
//postSchema for posts i.e. queries
const postSchema=new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  votes: { type: Number },
  name: { type: String },
  date: { type: String }
});
//voteSchema for votes for upvote downvote
const voteSchema=new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  vote: { type: String }
});
const adminSchema=new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: {type: String }
});
const Admin=new mongoose.model("Admin",adminSchema);
const admin=new Admin({
  email: "admin@mnnit.ac.in",
  name: "Admin",
  password: "hello@123"
});
admin.save();
const Vote = mongoose.model('Vote', voteSchema);
const Post=new mongoose.model("Post",postSchema);
//making a new mongoose model(collection) for contacts
const Contact=new mongoose.model("Contact",contactSchema);
const User=new mongoose.model("User",userSchema);
//get requests for our routes
app.get("/",function(req,res){
    res.render("home");
  });
app.get("/signup",function(req,res){
  res.render("signup");
});
app.get("/signin_admin",function(req,res){
  res.render("signin_admin");
});
app.get("/signin_student",function(req,res){
  res.render("signin_student");
});
app.get("/success",function(req,res){
  res.render("success",{message: "You have successfully signed up to our Hostel Management System"});
});
app.get("/failure_password",function(req,res){
  res.render("failure",{ message: "Sorry Password and Confirm Password does not match",sign: "Up",url: "/signup"});
});
app.get("/failure_email",function(req,res){
  res.render("failure",{ message: "You have already signed up with this email address!",sign: "Up",url: "/signup"});
});
app.get("/query_page",requireAuthenticate,function(req,res){
   Post.find({},function(err,results){
     if(err)
     console.log(err);
     else
    res.render("user_page",{ posts: results ,name: nm, email: ema});
  });
});
app.get("/admin_page",function(req,res){
  Post.find({},function(err,results){
    if(err)
    console.log(err);
    else
   res.render("admin_page",{ posts: results ,name: admin.name, email: admin.email});
 });
   });
app.post("/query_page",function(req,res){ //taking queries and sending to user_page.ejs
  User.findOne({email: ema},function(err,user){
    if(err)
    console.log(err);
    else if(!user)
    res.send("User not found");
    else
    {

      //saving post to database 
      const post=new Post({
        title: req.body.tittle,
        content: req.body.message,
        votes: 0,
        name: user.name,
        date: date.getDate()
    });
    posts.push(post);
    post.save();
    console.log(posts.length);
    postId=post._id; //unique
    res.redirect("/query_page");
  }
  
  });
});
app.post('/upvote', bodyParser.json(), function(req, res){
  const postId = req.body.postId; //unique
  Vote.findOne({ user: userId, post: postId }, function(err, existingVote) { //finding if he had aleady upvoted
    if (err) {
      console.log(err);
    } else if (existingVote) {
      if(existingVote.vote=="downvote") //if it is downvoted then upvote it increase votes by 2
      {
        existingVote.vote="upvote"; //making it upvote
        existingVote.save();
        Post.findByIdAndUpdate(postId, { $inc: { votes: 2 } }, { new: true }, function(err, post){
          if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
          }
          for(var i=0;i<posts.length;i++)
          {
            if(posts[i].title==post.title && posts[i].content==post.content)
            posts[i].votes+=2;
          }
        });
          res.redirect("/query_page");
      }
    } else {
      // creating new vote
      const vote = new Vote({
        user: userId,
        post: postId,
        vote: "upvote"
      });
      vote.save();
      Post.findByIdAndUpdate(postId, { $inc: { votes: 1 } }, { new: true }, function(err, post){
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        for(var i=0;i<posts.length;i++)
        { //updating in posts
          if(posts[i].title==post.title && posts[i].content==post.content)
          posts[i].votes++;
        }
        res.redirect("/query_page");
        // res.send({ votes: post.votes });
      });
    }
  });
 
});
app.post('/downvote', bodyParser.json(), function(req, res){
  const postId = req.body.postId;
  
  Vote.findOne({ user: userId, post: postId }, function(err, existingVote) { //finding if he had aleady downvoted
    if (err) {
      console.log(err);
    } else if (existingVote) {
      if(existingVote.vote=="upvote") //if it is upvoted then upvote it decrease votes by 2
      {
        existingVote.vote="downvote";
        existingVote.save();
        Post.findByIdAndUpdate(postId, { $inc: { votes: -2 } }, { new: true }, (err, post) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
          }
          for(var i=0;i<posts.length;i++)
          { //updating in posts
            if(posts[i].title==post.title && posts[i].content==post.content)
            posts[i].votes-=2;
          }
        });
          res.redirect("/query_page");
      }
    } else {
      // creating  new vote
      const vote = new Vote({
        user: userId,
        post: postId,
        vote: "downvote"
      });
      vote.save();
      Post.findByIdAndUpdate(postId, { $inc: { votes: -1 } }, { new: true }, (err, post) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        for(var i=0;i<posts.length;i++)
        {
          if(posts[i].title==post.title && posts[i].content==post.content)
          posts[i].votes--;
        }
        res.redirect("/query_page");
       // res.send({ votes: post.votes });
      });
    }
  });
});
//post request for our routes
app.post("/",function(req,res){ //storing the contact information in contacts model
  const newContact=new Contact({
    name: req.body.name,
    email: req.body.email,
    PhoneNumber: req.body.phone,
    message: req.body.message
  });
  newContact.save();
  res.render("success",{message: "Our Team will contact you shortly!"});
});
app.post("/signup",function(req,res){
  const email=req.body.email;
User.findOne({ email: email },function(err,user){ //for checking if user already signed up with this email
  if(err) throw err;
  if(user)
  res.redirect("/failure_email");
  else{
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){ //making the password encrypted to store it in hashed format
      const newUser=new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        retype: hash
      });
      if(req.body.password == req.body.password1)
      {
      newUser.save();
      res.redirect("/success");
      }
      else
      res.redirect("/failure_password");
    });
  }
  });
});
app.post("/signin_student",function(req,res){
  ema=req.body.username;
  User.findOne({email : req.body.username},function(err,user){
      if(err)
      console.log(err);
      else
      {
          if(user){
            nm=user.name;
            userId=user._id;
            bcrypt.compare(req.body.password,user.password,function(err,result){ //checking the password if its correct
              if(result==true)
              {
              req.session.userId=user._id;
              res.redirect("/query_page");
              }
              else
              res.render("failure",{message: "Username or Password may not be correct",sign: "In",url: "/signin_student"});
            });
          }
          else
          res.render("failure",{message: "You have not yet Signed Up",sign: "In",url: "/signin_student"});
      }
  });
});
app.get("/forget",function(req,res){
  res.render("forget");
});
app.post('/forget', function(req, res) { //recieving the email address to wich the reset link sent
  const email = req.body.email;

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      res.status(500).send('Server error');
    } else if (!user) {
      res.status(404).send('User not found');
    } else { 
      token = crypto.randomBytes(20).toString('hex');
      user.token=token;
      user.save();
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: { //user details from which mail to be sent
              user: '',
              pass: ''
            }
          });
          const mailOptions = { //mail sending
            from: '',
            to: email,
            subject: 'Test email',
            html: `<p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="http://localhost:3000/reset/${token}">Click on this</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              res.send("Verification email sent!");
            }
          });
    }
  });
});
app.get('/reset/:token',function(req,res){
  res.render("reset_password");
});
app.post('/reset/:token', (req, res) => { //post request through token 
  console.log(token);
  const password = req.body.password;

  User.findOne({token: token}, (err, user) => { //finding the user by token and updating password
    if (err) {
      res.status(500).send('Server error');
    } else if (!user) {
      res.status(404).send('Invalid Link');
    } else {
      bcrypt.hash(password,saltRounds,function(err,hash){
        User.updateMany({ token: token }, { password: hash, retype: hash }); 
      });
      user.token = undefined;
  user.save((err) => {
    if (err) {
      res.status(500).send('Server error');
    } else {
      res.send('Password updated');
    }
  });
}
  });
});
app.post("/signin_admin",function(req,res){
  Admin.findOne({email : req.body.username},function(err,user){
    console.log("hello");
    if(err)
    console.log(err);
    else
    {
        if(user){
            if(req.body.password==user.password)//checking the password if its correct
            {
            req.session.userId=user._id;
            res.redirect("/admin_page");
            }
            else
            res.render("failure",{message: "Username or Password may not be correct",sign: "In",url: "/signin_admin"});
          }
        else
        res.render("failure",{message: "Username or Password may not be correct",sign: "In",url: "/signin_admin"});
    }
});
});
app.post("/delete",function(req,res){
  const cId=req.body.checkbox;
  Post.findByIdAndRemove(cId,function(err){
    if(err)
    console.log(err);
    else
    {
      res.redirect("/admin_page");
    }
  })
});
app.listen(3000, function() { //generating server at port 3000
    console.log("Server started on port 3000");
  });
