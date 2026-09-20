const express = require('express');
const router = express.Router();

const ctrlMain = require('../controllers/main');
const ctrlTravel = require('../controllers/travel');

router.get('/', ctrlMain.index);
router.get('/travel', ctrlTravel.travel);

module.exports = router;
