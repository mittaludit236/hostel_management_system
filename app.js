const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const _=require("lodash");
const mongoose=require("mongoose");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
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
  res.render("success");
});
app.get("/failure",function(req,res){
  res.render("failure");
});
app.post("/signup",function(req,res){
  const newUser=new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    retype: req.body.password1
  });
  if(req.body.password == req.body.password1)
  {
  newUser.save();
  res.redirect("/success");
  }
  else
  res.redirect("/failure");
});






app.listen(3000, function() {
    console.log("Server started on port 3000");
  });