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
    date: { type: String },
    uid: {type: String },
    image: {type:String },
});
const Post=new mongoose.model("Post",postSchema);
module.exports=Post;