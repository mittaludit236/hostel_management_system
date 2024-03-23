const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Post = require('../models/Post');
const Contact = require('../models/Contact');
const Vote = require('../models/Vote');
const date=require("../utilities/date.js");
const {Admin,admin}=require("../models/Admin");
const { getToken } = require('../utilities/help');
const passport = require('passport');
const session=require("express-session");
const saltRounds = 10;
const posts=[];
var postId;
var userId;
exports.postQueryPage=(req,res)=>{

  console.log("hello");
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SERVER_MAIL,
        pass: process.env.NODE_M,
      },
      tls: {
        rejectUnauthorized: false
      },
    });

    // Send email and await the result
    const info =  transporter.sendMail({
      from: process.env.SERVER_MAIL,
      to: "pandeysujal591@gmail.com",
      subject: "New File Uploaded to Cloudinary",
      html: `<p>Hello Sir, This is to notify you that the query is still unresolved which was published </p>`
    });

    console.log("Info : ", info);

    // Send success response to the client
  
  } catch (err) {
    console.log(err);


}
    User.findOne({_id: req.params.id},function(err,user){
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
        const pp="/query_page/"+req.params.id;
        res.redirect(pp);
      }
      
      });
};
exports.upvote=(req,res)=>{
    const postId = req.body.postId; //unique
  console.log(req.body);
  Vote.findOne({ user: req.params.id, post: postId }, function(err, existingVote) { //finding if he had aleady upvoted
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
        user: req.params.id,
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
};
exports.downvote=(req,res)=>{
    const postId = req.body.postId;
  
    Vote.findOne({ user: req.params.id, post: postId }, function(err, existingVote) { //finding if he had aleady downvoted
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
          res.json({ success: true, postId: postId });
            //res.redirect("/query_page");
        }
      } else {
        // creating  new vote
        const vote = new Vote({
          user: req.params.id,
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
          res.json({ success: true, postId: postId });
          //res.redirect("/query_page");
         // res.send({ votes: post.votes });
        });
      }
    });
};
exports.delete=(req,res)=>{
    const cId=req.body.checkbox;
  Post.findByIdAndRemove(cId,function(err){
    if(err)
    console.log(err);
    else
    {
      res.redirect("/admin_page");
    }
  });
}
// exports.sendReminder = (req, res) => {
//   const email = req.body.email;
//   const date = req.body.date;

//   const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       requireTLS: true,
//       auth: {
//          user: process.env.SERVER_MAIL,
          pass: process.env.NODE_M,
//       }
//   });

//   const mailOptions = {
//       from: email,
//       to: process.env.SERVER_MAIL,
//       subject: 'Test email',
//       html: `<p>Hello Sir, This is to notify you that the query is still unresolved which was published on ${date}</p>`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.log('Error sending email:', error); // Log the error for debugging
//         return res.status(500).json({ success: false, message: 'Error sending reminder email' });
//     } else {
//         console.log('Email sent: ' + info.response);
//         return res.status(200).json({ success: true, message: 'Reminder email sent successfully' });
//     }
// });

// };


exports.sendReminder = async (req, res) => {
  const email = req.body.email;
  const date = req.body.date;
 console.log("hello");
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      post:587,
      secure:false,

      auth: {
          user: process.env.SERVER_MAIL,
          pass: process.env.NODE_M,
      },
      tls: {
          rejectUnauthorized: false
      },
    
  });
  


    const info = await transporter.sendMail({
      from: process.env.SERVER_MAIL,
      to: "pandeysujal591@gmail.com",
      subject: "New File Uploaded to Cloudinary",
      html:` <p>Hello Sir, This is to notify you that the query is still unresolved which was published on ${date}</p>`
    });

    console.log("Info : ", info);
    res.status(200).json({ success: true, message: 'Reminder email sent successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Error sending reminder email' });
  }
}
