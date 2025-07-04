// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
//
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body; // поле password
//     try {
//         const user = await User.findOne({ email });
//         if (!user || !await bcrypt.compare(password, user.haslo)) {
//             return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
//         }
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({
//             success: true,
//             token,
//             user: {
//                 _id: user._id,
//                 imie: user.imie,
//                 nazwisko: user.nazwisko,
//                 email: user.email,
//                 role: user.role,
//                 specialty: user.specialty
//             }
//         });
//     } catch (err) {
//         console.error('Login error:', err);
//         res.status(500).json({ message: 'Błąd serwera' });
//     }
// });
//
// router.post('/register', async (req, res) => {
//     const { imie, nazwisko, email, password, role, specialty } = req.body; // поле password
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Użytkownik o podanym emailu już istnieje' });
//         }
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         const user = new User({
//             imie,
//             nazwisko,
//             email,
//             haslo: hashedPassword, // в базе поле "haslo"
//             role,
//             specialty: role === 'doctor' ? specialty : ''
//         });
//         await user.save();
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(201).json({
//             success: true,
//             message: 'Rejestracja pomyślna',
//             user: {
//                 _id: user._id,
//                 imie: user.imie,
//                 nazwisko: user.nazwisko,
//                 email: user.email,
//                 role: user.role,
//                 specialty: user.specialty
//             },
//             token
//         });
//     } catch (err) {
//         console.error('Registration error:', err);
//         res.status(500).json({ message: 'Błąd podczas rejestracji', error: err.message });
//     }
// });
//
// module.exports = router;


//
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs'); // Use bcryptjs as installed
// const jwt = require('jsonwebtoken');
// const { User } = require('../models/User'); // Correct import
//
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body; // Match LoginPage.js credentials
//         console.log('Login attempt:', { email });
//         if (!email || !password) {
//             return res.status(400).json({ success: false, message: 'Email i hasło są wymagane' });
//         }
//
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ success: false, message: 'Nieprawidłowy email lub hasło' });
//         }
//
//         const isMatch = await bcrypt.compare(password, user.haslo);
//         if (!isMatch) {
//             return res.status(401).json({ success: false, message: 'Nieprawidłowy email lub hasło' });
//         }
//
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: '1d' }
//         );
//
//         res.json({
//             success: true,
//             token,
//             user: {
//                 _id: user._id,
//                 imie: user.imie,
//                 nazwisko: user.nazwisko,
//                 email: user.email,
//                 role: user.role,
//                 specialty: user.specialty || ''
//             }
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ success: false, message: 'Błąd serwera podczas logowania', error: error.message });
//     }
// });
//
// router.post('/register', async (req, res) => {
//     const { imie, nazwisko, email, password, role, specialty } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: 'Użytkownik o podanym emailu już istnieje' });
//         }
//
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({
//             imie,
//             nazwisko,
//             email,
//             haslo: hashedPassword,
//             role: role || 'patient',
//             specialty: role === 'doctor' ? specialty : ''
//         });
//         await user.save();
//
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: '1d' }
//         );
//
//         res.status(201).json({
//             success: true,
//             message: 'Rejestracja pomyślna',
//             token,
//             user: {
//                 _id: user._id,
//                 imie: user.imie,
//                 nazwisko: user.nazwisko,
//                 email: user.email,
//                 role: user.role,
//                 specialty: user.specialty
//             }
//         });
//     } catch (err) {
//         console.error('Registration error:', err);
//         res.status(500).json({ success: false, message: 'Błąd podczas rejestracji', error: err.message });
//     }
// });
//
// module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Використовуємо bcryptjs
const jwt = require('jsonwebtoken');
const { User } = require('../models/User'); // Імпортуємо модель User

// Логін користувача
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email });

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email i hasło są wymagane' });
        }

        // Знаходимо користувача за email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Nieprawidłowy email lub hasło' });
        }

        // Перевіряємо чи співпадає хешований пароль
        const isMatch = await bcrypt.compare(password, user.haslo);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Nieprawidłowy email lub hasło' });
        }

        // Генеруємо токен
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Термін дії токена - 1 день
        );

        return res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                imie: user.imie,
                nazwisko: user.nazwisko,
                email: user.email,
                role: user.role,
                specialty: user.specialty || ''
            }
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ success: false, message: 'Błąd serwera podczas logowania', error: error.message });
    }
});

// Реєстрація нового користувача
router.post('/register', async (req, res) => {
    const { imie, nazwisko, email, password, role, specialty } = req.body;

    try {
        console.log('Registration attempt:', { email });

        // Перевіряємо, чи користувач уже існує
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Użytkownik o podanym emailu już istnieje' });
        }

        // Хешуємо пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Створюємо нового користувача
        const user = new User({
            imie,
            nazwisko,
            email,
            haslo: hashedPassword, // Поле "haslo" для пароля
            role: role || 'patient', // Роль за замовчуванням - 'patient'
            specialty: role === 'doctor' ? specialty : '' // Спеціальність лише для лікарів
        });

        await user.save();

        // Генеруємо токен
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(201).json({
            success: true,
            message: 'Rejestracja pomyślna',
            token,
            user: {
                _id: user._id,
                imie: user.imie,
                nazwisko: user.nazwisko,
                email: user.email,
                role: user.role,
                specialty: user.specialty
            }
        });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ success: false, message: 'Błąd podczas rejestracji', error: err.message });
    }
});

module.exports = router;