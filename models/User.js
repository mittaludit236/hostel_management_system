const mongoose = require('mongoose');

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
  id: {
    type: String,
  },
  token: {
    type: String,
  },
  blocked: {
    type: Boolean,  
    default: false,
  },
<<<<<<< HEAD
  posts:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
    }
  ],
  
=======
  count:{
    type:Number,
    default:0,
  }
>>>>>>> 92e0bddd500199bfc3f2fa0e4b2145c9a54e7afa
});


module.exports = mongoose.model('User', userSchema);
