const mongoose=require("mongoose");
const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    PhoneNumber: {
      type: String,
      required: true
    },
    message: {
      type: String
    }
  });
//making a new mongoose model(collection) for contacts
const Contact=new mongoose.model("Contact",contactSchema);
module.exports=Contact;