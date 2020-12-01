const express = require('express');
const router = express.Router();
const productDetailController = require('../controllers/productDetailController');

/* GET list of books. */
router.get('/', productDetailController.index);

module.exports = router;