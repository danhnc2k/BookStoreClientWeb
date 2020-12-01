const express = require('express');
const router = express.Router();
const CreAccController = require('../controllers/CreAccController');

/* GET list of books. */
router.get('/', CreAccController.index);


module.exports = router;