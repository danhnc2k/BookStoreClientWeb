const Product = require('../models/product');

exports.count = (filter = {}) => Product.find(filter).countDocuments();

exports.listproduct = (filter = {}, page = 1, itemPerPage = 12, sortObject) => {
    const res = Product.paginate(filter, {page: page, limit: itemPerPage, sort: sortObject,});
    return res;
};
