
const mongoose = require("mongoose")

async function connect(){
    try {
        await mongoose.connect("mongodb+srv://ducnghu:ducnghu18120165@cluster0.3cbcn.mongodb.net/ClothesStore?retryWrites=true&w=majority/ClothesStore/",{
            //   useNewUrlParser: true,
            //   useUnifiedTopology: true,
            //   useCreateIndex: true,
        })
        console.log("connected")
    } catch (error) {
        console.log("failed")
    }
}

module.exports = {connect}