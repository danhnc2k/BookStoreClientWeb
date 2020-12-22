const Categories = require("../models/productCategory");

exports.mainCategoryName = function () {
    var tmp = [];
    Categories.find().then(cats =>{
        cats.forEach(cat => {
            tmp.push({_id:cat._id.toString(), name:cat.name});
        });
    });
    return tmp;
};

exports.subCategoryName = function () {
    var tmp = [];
    Categories.find().then(cats =>{
        cats.forEach(cat => {
            cat.childName.forEach(subcat => {
                tmp.push({_id:subcat._id.toString(), name:subcat.name});
            });
        });
    });
    return tmp;
};

exports.allCategories = () => Categories.find();