const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labelSchema = new Schema({
  name:{
    type: String,
    require: true,
  }
});

const Label = mongoose.model("Label", labelSchema);
module.exports = Label;
