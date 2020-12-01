const CreAccModel = require('../models/CreAccModel');

exports.index = (req, res, next) => {
    // Get books from model
    const CreAcc = CreAccModel.list();
    // Pass data to view to display list of books
    res.render('CreAcc', { CreAcc });
};