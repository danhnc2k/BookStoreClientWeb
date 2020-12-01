const bookModel = require('../models/bookModel');

exports.index = (req, res, next) => {
    // Get books from model
    const books = bookModel.list();
    console.log(books);
    // Pass data to view to display list of books
    res.render('products/list', {books});
};