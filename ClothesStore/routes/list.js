const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

/* GET list of books. */
router.get('/', listController.index);


module.exports = router;