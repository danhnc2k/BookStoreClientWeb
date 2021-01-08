const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productCategorySchema = new Schema({
  name: String,
  childName: [
      {
        name: String,
      }
    ]
},{ collection : 'Categories' });

const Category = mongoose.model(
  "Category",
  productCategorySchema
);
module.exports = Category;
