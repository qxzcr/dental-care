const { User } = require('../models/User'); // Імпорт моделі користувача
const bcrypt = require('bcryptjs');

// Отримати всіх користувачів
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ role: 1, imie: 1 });
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};

// Створення нового користувача
exports.createUser = async (req, res) => {
    const { imie, nazwisko, email, haslo, role } = req.body;

    if (!imie || !nazwisko || !email || !haslo || !role) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Перевіряємо, чи вже існує такий email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already exists' });
        }

        // Хешуємо пароль
        const hashedPassword = await bcrypt.hash(haslo, 10);

        // Створюємо нового користувача
        const newUser = new User({
            imie,
            nazwisko,
            email,
            haslo: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Server error during user creation' });
    }
};

// Оновлення даних користувача
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { imie, nazwisko, email, haslo, role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Оновлюємо дані
        if (imie) user.imie = imie;
        if (nazwisko) user.nazwisko = nazwisko;
        if (email) user.email = email;
        if (haslo) user.haslo = await bcrypt.hash(haslo, 10);
        if (role) user.role = role;

        await user.save();
        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Server error during user update' });
    }
};

// Видалення користувача
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Тільки адміністратор може видалити користувача
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'No permission to delete user' });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
};