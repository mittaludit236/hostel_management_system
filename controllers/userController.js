const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Post = require('../models/Post');
const Contact = require('../models/Contact');
const {Admin,admin}=require("../models/Admin");
const saltRounds = 10;
var token="";
exports.getQueryPage = (req, res) => {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    if (!user) {
      return res.status(404).send("User not found");
    }

    
    const notifications = user.notifications ;

    Post.find({}, function(err, results) {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      // Render the user page with posts, user details, and notification count
      res.render("user_page", {
        posts: results,
        name: user.name,
        email: user.email,
        id: req.params.id,
        notifications: notifications,
      });
    });
  });
};


exports.getPersonalQueriesPage = (req, res) => {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      console.log(err);
      res.status(500).send("Error occurred");
      return;
    }
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    Post.find({ name: user.name }, function(err, results) {
      if (err) {
        console.log(err);
        res.status(500).send("Error occurred");
        return;
      }
      res.render("my_queries", {
        posts: results,
        name: user.name,
        email: user.email,
        id: req.params.id
      });
    });
  });
};


exports.getAdminPage = (req, res) => {
    Post.find({},function(err,results){
        if(err)
        console.log(err);
        else
       res.render("admin_page",{ posts: results ,name: admin.name, email: admin.email});
     });
};
exports.postContact= (req,res) =>{
    const newContact=new Contact({
        name: req.body.name,
        email: req.body.email,
        PhoneNumber: req.body.phone,
        message: req.body.message
      });
      newContact.save();
      res.render("success",{message: "Our Team will contact you shortly!"});
};
exports.getForgetPage= (req,res) =>{
    res.render("forget");
};

exports.postForgetPage= (req,res)=>{
    const email = req.body.email;

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      res.status(500).send('Server error');
    } else if (!user) {
      res.status(404).send('User not found');
    } else { 
      console.log(user);
      token = crypto.randomBytes(20).toString('hex');
      user.token=token;
      user.save();
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: { //user details from which mail to be sent
              user: process.env.SERVER_MAIL,
              pass: process.env.NODE_M,
            }
          });
          const mailOptions = { //mail sending
            from: process.env.SERVER_MAIL,
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
};
exports.getResetPage=(req,res)=>{
    res.render("reset_password",{tok: req.params.id});
};
exports.postResetPage = (req, res) => {
    const password = req.body.password;
    User.findOne({ token: req.params.id }, (err, user) => {
      console.log(user);
      if (err) {
        res.status(500).send('Server error');
      } else if (!user) {
        res.status(404).send('Invalid Link');
      } else {
        // Hash the new password
        bcrypt.hash(password, saltRounds, function(err, hash) {
          if (err) {
            res.status(500).send('Server error');
            return; // Exit the function in case of error
          }
          // Update the user's password with the hashed password
          user.password = hash;
          // Clear the reset token
          user.token = undefined;
          // Save the updated user object
          user.save((err) => {
            if (err) {
              res.status(500).send('Server error');
            } else {
              res.send('Password updated');
            }
          });
        });
      }
    });
};

exports.getNotifications = async (req, res) => {
  console.log("check check");

  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('notifications.postId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ notifications: user.notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};