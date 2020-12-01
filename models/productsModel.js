const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug)

const Schema = mongoose.Schema

const Product = new Schema({
    name: {type: String},
    price: {type: Number},
    image: {type: String},
    description: {type: String},
    men: {type: Boolean, default: false},
    women: {type: Boolean, default: false},
    kids: {type: Boolean, default: false},
    slug: {type: String, slug: "name", unique: true},
},
{
    timestamps: true
})

module.exports = mongoose.model('Product', Product)