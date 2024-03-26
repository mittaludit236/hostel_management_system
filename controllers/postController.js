const nodemailer = require('nodemailer');
const User = require('../models/User');
const Post = require('../models/Post');
const Vote = require('../models/Vote');
const date=require("../utilities/date.js");
exports.postQueryPage=(req,res)=>{

  console.log("hello");
  
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
            date: date.getDate(),
            uid: req.params.id,
        });
        post.save();
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
            subject: "Query Status Update",
    html:`
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Query Status Notification</h2>
        <p>There is a query posted by <strong>Mr. ${post.name}</strong> on <strong>${post.date}</strong> </p>
        <p>Please click the button below to log in to view the details of your query and provide any further information if necessary.</p>
        <a href="http://localhost:3000/signin_admin" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; font-size: 16px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Login to View Query</a>
      </div>
    `
          });
      
          console.log("Info : ", info);
      
          // Send success response to the client
        
        } catch (err) {
          console.log(err);
      }
        const pp="/query_page/"+req.params.id;
        res.redirect(pp);
      }
      
      });
};
exports.upvote=(req,res)=>{
    const postId = req.body.postId; //unique
  console.log(req.body);
  console.log("Hello12345");
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
          }
          else
          res.json({ success: true, postId: postId });
        });
       
          //res.redirect("/query_page");
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
        }
        else
        res.json({ success: true, postId: postId });
        //res.redirect("/query_page");
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
            }
            else
            res.json({ success: true, postId: postId });
          });
         // res.redirect("/query_page");
           // res.redirect("/query_page");
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
          }
          else
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
  

  const post=await Post.findById(req.params.id);
  const info = await transporter.sendMail({
    from: process.env.SERVER_MAIL,
    to: "pandeysujal591@gmail.com",
    subject: "Query Status Update",
    html:`
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Query Status Notification</h2>
        <p>The query posted by <strong>${post.name}</strong> on <strong>${post.date}</strong> is still unresolved.</p>
        <p>Please click the button below to view the details of your query and provide any further information if necessary.</p>
        <a href="http://localhost:3000/signin_admin" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; font-size: 16px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Login to View Query</a>
      </div>
    `
  });
    console.log("Info : ", info);
    res.status(200).json({ success: true, message: 'Reminder email sent successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Error sending reminder email' });
  }
};
exports.getEditPost=async(req,res)=>{
    const post = await Post.findById(req.params.postId);
    res.json(post);
};
exports.postEdit=async(req,res)=>{
    const { postId, userId } = req.params;
    const { title, content } = req.body;
    await Post.findByIdAndUpdate(postId, { title, content });
    const u="/my_queries/"+userId;
    res.redirect(u);
}

