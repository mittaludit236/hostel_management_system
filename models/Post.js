const mongoose=require("mongoose");
const postSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title: { type: String },
    content: { type: String },
    votes: { type: Number },
    name: { type: String },
    date: { type: Date },
    uid: {type: String },
<<<<<<< HEAD
    image: {type:String },
=======
    bdate: {type: Date},
>>>>>>> 92e0bddd500199bfc3f2fa0e4b2145c9a54e7afa
});
const Post=new mongoose.model("Post",postSchema);
module.exports=Post;