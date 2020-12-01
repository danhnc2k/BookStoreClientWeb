const productsModel = require('../models/productsModel');

exports.index = (req, res, next) => {
    const productlist = productsModel.find({})
        .then(products => res.render("products/products",{products}))
        .catch(next)
};

exports.detail = (req, res, next) => {
    const productdetail = productsModel.find({slug: req.params.slug})
        .then(product => res.render("products/productDetail",{product}))
        .catch(next)
};