const indexModel = require('../models/indexModel');

exports.index = (req, res, next) => {
    // Get books from model
    const index = indexModel.list();
    // Pass data to view to display list of books
    res.render('index', {index});
};