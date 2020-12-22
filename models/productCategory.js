const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productCategorySchema = new Schema({
  name: String,
  childName: [
      {
        name: String,
      }
    ]
});

const productCategory = mongoose.model(
  "productCategory",
  productCategorySchema
);
module.exports = productCategory;
