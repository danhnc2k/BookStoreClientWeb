const Product = require('../models/product');

exports.count = (filter = {}) => Product.find(filter).countDocuments();

exports.listproduct = (filter = {}, page = 1, itemPerPage = 12, sort = null) => {
    const res = Product.paginate(filter, {page: page, limit: itemPerPage, sort: {price: sort},});
    return res;
};
