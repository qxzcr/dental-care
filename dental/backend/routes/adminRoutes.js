const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const rolesMiddleware = require('../middleware/rolesMiddleware');
const { getUsers, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/users', authMiddleware, rolesMiddleware('admin'), getUsers);
router.put('/users/:id', authMiddleware, rolesMiddleware('admin'), updateUser);

module.exports = router;