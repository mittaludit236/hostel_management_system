const mongoose=require("mongoose");
const adminSchema=new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: {type: String }
});
const Admin=new mongoose.model("Admin",adminSchema);
const admin=new Admin({
    email: process.env.ADMIN_MAIL,
    name: "Admin",
    password: process.env.ADMIN_PASS,
});
module.exports={Admin,admin};
//admin.save();