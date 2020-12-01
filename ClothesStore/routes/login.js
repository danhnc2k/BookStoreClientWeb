const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

/* GET list of books. */
router.get('/', loginController.index);


module.exports = router;