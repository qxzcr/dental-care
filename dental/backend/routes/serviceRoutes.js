const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', serviceController.getServices);
router.post('/', protect, adminOnly, serviceController.createService);

module.exports = router;