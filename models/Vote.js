const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const voteSchema=new mongoose.Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    },
    vote: { type: String }
});
const Vote = mongoose.model("Vote", voteSchema);
module.exports=Vote;