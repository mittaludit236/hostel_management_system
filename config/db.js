// db.js
const mongoose = require("mongoose");

async function connectToDatabase() {
    try {
        await mongoose.connect(
            "mongodb+srv://mittaludit768:" + process.env.MONGO_P + "@hostelmanagement.iky6mce.mongodb.net/?retryWrites=true&w=majority&appName=HostelManagement",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error occurred while connecting to MongoDB");
        console.error(error);
    }
}

module.exports = connectToDatabase;
