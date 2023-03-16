const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const http=require("http");
const app = express();
const _=require("lodash");
const mongoose=require("mongoose");
app.set('view engine', 'ejs');
mongoose.connect("mongodb+srv://mittaludit236:12345@cluster0.bqkcjhs.mongodb.net/?retryWrites=true&w=majority",{ useNewUrlParser: true });
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
app.get("/failure_password",function(req,res){
  res.render("failure",{ message: "Sorry Password and Confirm Password does not match" });
});
app.get("/failure_email",function(req,res){
  res.render("failure",{ message: "You have already signed up with this email address!" });
});
app.post("/signup",function(req,res){
  const email=req.body.email;
User.findOne({ email: email },function(err,user){
  if(err) throw err;
  if(user)
  res.redirect("/failure_email");
  else{
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
    res.redirect("/failure_password");
  }
  });
});






app.listen(3000, function() {
    console.log("Server started on port 3000");
  });