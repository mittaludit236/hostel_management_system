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
  count:{
    type:Number,
    default:0,
  }
});


module.exports = mongoose.model('User', userSchema);
