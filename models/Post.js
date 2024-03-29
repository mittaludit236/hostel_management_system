const mongoose=require("mongoose");
const postSchema=new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    votes: { type: Number },
    name: { type: String },
    date: { type: String },
    uid: {type: String },

});
const Post=new mongoose.model("Post",postSchema);
module.exports=Post;