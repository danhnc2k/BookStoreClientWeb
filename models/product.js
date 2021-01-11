const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;
const removeAccent = require("../util/removeAccent");

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: "Một sản phẩm từ Bros"
  },
  stock: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: [String],
    required: true
  },
  category: {
    main: String,
    sub: String
  },
  color: {
    type: [String],
    required: true
  },
  tags: {
    type: [String],
    required: false
  },
  images: {
    type: [String],
    required: true
  },
  dateAdded: {
    type: Date,
    required: false,
    default: Date.now
  },
  labels: {
    type: String,
    required: false
  },
  materials: {
    type: [String],
    required: false
  },
  buyCounts: {
    type: Number,
    required: false,
    default: 0
  },
  viewCounts: {
    type: Number,
    required: false,
    default: 0
  },
  index: {
    type: Number,
    required: false,
    default: 0
  },
  comment: {
    total: {
      type: Number,
      require: false,
      default: 0
    },
    items: [
      {
        title: {
          type: String
        },
        content: {
          type: String
        },
        name: {
          type: String
        },
        date: {
          type: Date,
          default: Date.now
        },
        star: {
          type: Number
        }
      }
    ]
  },
  isDeleted: {
    type: Boolean
  }
},{ collection : 'Products' });

productSchema.plugin(mongoosePaginate);

const index = {
  name: "text",
  description: "text",
  labels: "text",
  "category.main": "text",
  tags: "text",
  ofSellers: "text"
};
productSchema.index(index);

productSchema.methods.getNonAccentType = function() {
  return removeAccent(this.category.main);
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
