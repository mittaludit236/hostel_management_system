const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const _=require("lodash");
const mongoose=require("mongoose");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://mittaludit236:12345@cluster0.bqkcjhs.mongodb.net/?retryWrites=true&w=majority",{ useNewUrlParser: true });
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
    required: true,
    minlength: 8
  },
  retype: {
    type: String,
    required: true,
    minlength: 8
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
  Phone_Number: {
    type: Number,
    required: true
  },
  Message: {
    type: String
  }
});
const User=new mongoose.model("User",userSchema);
const Contact=new mongoose.model("Contact",contactSchema);
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
app.post("/",function(req,res){
  const contact=new Contact({
    name: req.body.name,
    email: req.body.email,
    Phone_Number: req.body.phone,
    Message: req.body.message
  });
  contact.save();
  res.redirect("/");
})
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