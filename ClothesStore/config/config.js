
const mongoose = require("mongoose")


const dev_db_url = "mongodb+srv://ducnghu:ducnghu18120165@cluster0.3cbcn.mongodb.net/ClothesStore?retryWrites=true&w=majority"
const mongodb = process.env.MONGODB_URI || dev_db_url;
async function connect(){
    try {
        await mongoose.connect(mongodb,{
              useNewUrlParser: true,
              useUnifiedTopology: true,
              //useCreateIndex: true,
        })
        console.log("connected")
    } catch (error) {
        console.log("failed")
    }
}

module.exports = {connect}
