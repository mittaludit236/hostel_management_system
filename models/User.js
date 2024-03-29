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
  posts:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
    }
  ],
  
});

// Export user model
module.exports = mongoose.model('User', userSchema);
