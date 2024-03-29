const mongoose=require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
    },
    id:{
      type: String,
    },
    posts:[
      {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Post"
      }
    ],
  });
const User=new mongoose.model("User",userSchema);
module.exports=User;