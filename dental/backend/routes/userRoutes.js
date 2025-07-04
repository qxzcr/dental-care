const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

// Отримати всіх користувачів
router.get('/', authMiddleware, getUsers);

// Створити нового користувача
router.post('/register', authMiddleware, createUser);

// Оновити дані користувача
router.put('/:id', authMiddleware, updateUser);

// Видалити користувача
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;

