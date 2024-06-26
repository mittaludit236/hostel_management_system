const nodemailer = require('nodemailer');
const User = require('../models/User');
const Post = require('../models/Post');
const Notice =require('../models/Notice')
const Vote = require('../models/Vote');
const date=require("../utilities/date.js");

exports.postQueryPage=(req,res)=>{

  console.log("hello");
  
    User.findOne({_id: req.params.id}, async function(err,user){
        if(err)
        console.log(err);
        else if(!user)
        res.send("User not found");
        else
        {
    
         
          const post=new Post({
            user:user._id, //this is the user id given to post schema for post to remember which user posted this post
            title: req.body.tittle,
            content: req.body.message,
            votes: 0,
            name: user.name,
            date: date.getDate(),
            uid: req.params.id,
            image: req.file ? req.file.filename : undefined ,
            //image given the file uploaded
        });
        user.posts.push(post._id);
        try {
          await  post.save();
           await user.save();
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

        
        } catch (err) {
          console.log(err);
      }
        const pp="/query_page/"+req.params.id;
        res.redirect(pp);
      }
      
      });
};
exports.upvote=(req,res)=>{
    const postId = req.body.postId;
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

exports.createNotice = async (req, res) => {
  try {
      const newNotice = new Notice({
          content: req.body.message,
          createdAt: new Date()
      });

      const savedNotice = await newNotice.save(); // Wait for the save operation to complete

      console.log('Notice saved successfully:', savedNotice);
      res.redirect("/notice_page");
      
  } catch (error) {
      console.error('Error saving Notice:', error);
      // Handle the error accordingly, e.g., send an error response
      res.status(500).send('Error saving Notice');
  }
};

exports.deleteNotice=  (req,res)=>{
 
//     const noticeId=req.params.id;
    
//     console.log(noticeId);
//    try{ 
//     await Notice.findByIdAndDelete(noticeId,  (err, notice) => {
//       if (err) {
//         console.error(err);
//         res.sendStatus(500);
//       }
//       else
//       res.json({ success: true, noticeId: noticeId });
//     });

//    }catch (error) {
//     console.error('Error deleting notice:', error);
//     res.status(500).json({ error: 'Error deleting notice' });
// }

const noticeId = req.params.id;
    
console.log(noticeId);

Notice.findByIdAndDelete(noticeId, (err, notice) => {
    if (err) {
        console.error('Error deleting notice:', err);
        return res.sendStatus(500);
    }

    if (!notice) {
        console.log('Notice not found');
        return res.status(404).json({ error: 'Notice not found' });
    }

    console.log('Notice deleted successfully:', noticeId);
    res.json({ success: true });
});
};

   


exports.sendReminder = async (req, res) => {


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


exports.ResolveMail = async (req, res) => {
 
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(post.uid);
   console.log(post);
    const userEmail = user.email;
    const postId = req.params.id;

    post.bdate=date.getDate();
    post.save();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    user.notifications.push({
      postId: postId,
      message: 'The admin has resolved the query',
  
    });
    await user.save();
    

    

    // Send email notification to the user
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
      }
    });

    const info = await transporter.sendMail({
      from: 'admin@mnnit.ac.in',
      to: 'anuraggolu123@gmail.com',
      subject: "Query Status Update",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Query Status Notification</h2>
          <p>The query posted by <strong>${post.name}</strong> on <strong>${post.date}</strong> has been resolved.</p>
          <p>Please click the button below to view the details of your query and validate from your side.</p>
          <a href="http://localhost:3000/signin_admin" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; font-size: 16px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Login to View Query</a>
        </div>
      `
    });

    console.log("Info : ", info);
    console.log("User notifications updated successfully");

    res.status(200).json({ success: true, message: 'Email notification sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending email notification' });
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



exports.sendEmailToAdmin = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }



    // Save the updated user object
    await user.save();

    // Send email to admin
    const userEmail = user.email;
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
      }
    });

    const info = await transporter.sendMail({
      from: userEmail,
      to: 'admin@mnnit.ac.in',
      subject: "Query Status Update",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Query Status Notification</h2>
          <p>The query posted by <strong>${user.name}</strong> on <strong>${user.date}</strong> has been resolved.</p>
          <p>Please click the button below to view the details of your query and validate from your side.</p>
          <a href="http://localhost:3000/signin_admin" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; font-size: 16px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Login to View Query</a>
        </div>
      `
    });

    console.log("Info:", info);
    res.status(200).json({ success: true, message: 'Reminder email sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending reminder email' });
  }
};
exports.getPM=async(req,res)=>{
  console.log("dfaugk");
  const post=await Post.findById(req.params.id);
  console.log("hweeeeeeellllllll");
  if (post) {

    res.json({ success: true, content: post.content });
} else {
    // If no matching post is found, send an error message
    res.status(404).json({ success: false, message: 'Post not found' });
}
}
exports.postYes=async(req,res)=>{
  try {
    console.log(req.params.id + "YES");
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    const user = await User.findById(post.uid);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await User.updateOne(
      { _id: post.uid },
      { $pull: { notifications: { postId: req.params.id } } }
    );
    await Post.findByIdAndRemove(req.params.id);
    res.json({ success: true, content: post.content });
  } catch (err) {
    console.error("Error in postYes:", err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
}
exports.postNo=async(req,res)=>{

  try {

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    const user = await User.findById(post.uid);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await User.updateOne(
      { _id: post.uid },
      { $pull: { notifications: { postId: req.params.id } } }
    );
    post.bdate=undefined;
    await post.save();
    res.json({ success: true, content: post.content });
  } catch (err) {
    console.error("Error in postYes:", err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
}

exports.getComments = async (req, res) => {
  console.log("hello2");
  try {
    const post = await Post.findById(req.params.id);
 console.log("hello");
    if (post) {
    
      res.json({ success: true, comments: post.comments });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
};

exports.Comment = async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const user = await User.findById(post.uid);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }



    const newComment = {
      userId: user._id,
      userN: user.name,
      content: req.body.text, 
      date: new Date(),
  
    };

    post.comments.push(newComment);
    console.log("Checking if adding comment works4");
   
    await post.save();
 
    res.status(201).json({ success: true, message: 'Comment added successfully.' });
    console.log("Checking if adding comment works6");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add comment.' });
  }
};
