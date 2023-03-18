require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session=require("express-session");
const bcrypt=require("bcrypt");
const saltRounds=10;
const http=require("http");
const app = express();
const _=require("lodash");
const mongoose=require("mongoose");
app.set('view engine', 'ejs');
mongoose.connect("mongodb+srv://mittaludit236:12345@cluster0.bqkcjhs.mongodb.net/?retryWrites=true&w=majority",{ useNewUrlParser: true });
//mongoose.set("useCreateIndex",true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

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
const Contact=new mongoose.model("Contact",contactSchema);
const User=new mongoose.model("User",userSchema);
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
app.post("/",function(req,res){
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
User.findOne({ email: email },function(err,user){
  if(err) throw err;
  if(user)
  res.redirect("/failure_email");
  else{
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
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
  User.findOne({email : req.body.username},function(err,user){
      if(err)
      console.log(err);
      else
      {
          if(user){
            bcrypt.compare(req.body.password,user.password,function(err,result){
              if(result==true)
              res.render("home");
              else
              res.render("failure",{message: "Username or Password may not be correct",sign: "In",url: "/signin_student"});
            });
          }
          else
          res.render("failure",{message: "You have not yet signed up",sign: "In",url: "/signin_student"},);
      }
  });
});







app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
