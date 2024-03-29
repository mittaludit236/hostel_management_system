const bcrypt = require('bcrypt');
const User = require('../models/User');
const Post = require('../models/Post');
const {Admin,admin}=require("../models/Admin");
const { getToken } = require('../utilities/help');
const passport = require('passport');
const saltRounds = 10;
const invalidateUserSessions=require("../middleware/session");
exports.getHomePage = (req, res) => {
    res.render("home");
  };
exports.getSignUpPage = (req, res) => {
    res.render("signup");
};
exports.getSignInaPage = (req, res) => {
    res.render("signin_admin");
};
exports.getSignInPage = (req, res) => {
    res.render("signin_student");
};

exports.getSuccessPage = (req, res) => {
    res.render("success",{message: "You have successfully signed up to our Hostel Management System"});
};
exports.getFEPage = (req, res) => {
    res.render("failure",{ message: "You have already signed up with this email address!",sign: "Up",url: "/signup"});
};
exports.getFPPage = (req, res) => {
    res.render("failure",{ message: "Sorry Password and Confirm Password does not match",sign: "Up",url: "/signup"});
};
// authController.js

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/failure_email' }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/failure_email');
    
    // Implement your session or token logic here
    // For example, setting a session userId to a generated token or user's ID
    req.session.userId = user._id;  // Assuming the user object has an _id property
    res.redirect(`/query_page/${user._id}`);
  })(req, res, next);
};
exports.logout = (req, res) => {
    req.session.destroy((err)=>{
        if (err) {
          return res.status(500).send('Internal Server Error');
        }
        res.redirect("/");
      });
};
exports.postSignUpPage = (req, res) => {
    const email=req.body.email;
    User.findOne({ email: email },function(err,user){ //for checking if user already signed up with this email
      if(err) throw err;
      if(user)
      res.redirect("/failure_email");
      else{
        console.log(req.body);
        bcrypt.hash(req.body.password,saltRounds,function(err,hash){ //making the password encrypted to store it in hashed format
          if(err)
          console.log(err);
          const newUser=new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
          });
          //console.log();
          if(req.body.password === req.body.password1)
          {
          //newUser.save();
          User.create(newUser);
        const token=getToken(newUser.email,newUser);
        const uReturn={...newUser.toJSON(),token};
        delete uReturn.password;
          res.redirect("/success");
          }
          else
          res.redirect("/failure_password");
        });
      }
      });
};
exports.postSignInPage = (req, res) => {
  User.findOne({ email: req.body.username }, function(err, user) {
      if (err) {
          console.log(err);
          res.render("failure", { message: "An error occurred", sign: "In", url: "/signin_student" });
      } else {
          if (user) {
              if (user.blocked) {
                  return res.render("failure", { message: "Your account has been blocked", sign: "In", url: "/signin_student" });
              }
              bcrypt.compare(req.body.password, user.password, function(err, result) {
                  if (result == true) {
                      req.session.userId = user._id;
                      console.log(req.session);
                      const token = getToken(req.body.username, user);
                      const uReturn = { ...user.toJSON(), token };
                      delete uReturn.password;
                   

                      const p = "/query_page/" + user._id;
                      res.redirect(p);
                  } else {
                      res.render("failure", { message: "Username or Password may not be correct", sign: "In", url: "/signin_student" });
                  }
              });
          } else {
              res.render("failure", { message: "You have not yet Signed Up", sign: "In", url: "/signin_student" });
          }
      }
  }).populate("posts"); //populate function to include post information in user schema when he loges in
};

exports.postSignInAPage = (req, res) => {
    Admin.findOne({email : req.body.username},function(err,user){
        if(err)
        console.log(err);
        else
        {
            if(user){
                if(req.body.password==user.password)
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
};
exports.getBlockedUsers=(req,res)=> {

  User.find({}, function(err, users) {
      if (err) {
          console.error('Error fetching users:', err);
         
          return res.status(500).send('Internal Server Error');
      }

      res.render('users', { users: users });
  });
};
exports.postBlockedUsers = async (req, res) => {
  const userId = req.body.id;
  console.log(userId);
  try {
    // Delete posts associated with the user
    await Post.deleteMany({ uid: userId });

  
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the blocked state
    user.blocked = !user.blocked;
    await user.save();

    // If the user is blocked, terminate the session
    if (user.blocked) {
      await invalidateUserSessions(user._id);
      console.log("All sessions terminated for blocked user");
    }

    res.status(200).json({ message: "User block state updated successfully", blocked: user.blocked });
  } catch (error) {
    console.error("Error updating user block state:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


