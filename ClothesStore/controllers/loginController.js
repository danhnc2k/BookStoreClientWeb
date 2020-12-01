const loginModel = require('../models/loginModel');

exports.index = (req, res, next) => {
    // Get books from model
    const login = loginModel.list();
    // Pass data to view to display list of books
    res.render('login', {login});
};