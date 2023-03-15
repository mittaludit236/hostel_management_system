const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const _=require("lodash");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
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







app.listen(3000, function() {
    console.log("Server started on port 3000");
  });