// // middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');
// const { User } = require('../models/User');
//
// module.exports = async (req, res, next) => {
//     try {
//         // Отримання токена з заголовку Authorization
//         const token = req.header('Authorization')?.replace('Bearer ', '').trim();
//         console.log('Token received:', token);  // Debug
//
//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Authorization token not provided' });
//         }
//
//         // Розшифровка токена
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded token:', decoded);  // Debug
//
//         // Пошук користувача за ID
//         const user = await User.findById(decoded.id);
//         console.log('User found:', user);  // Debug
//
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
//
//         // Зберігаємо користувача в запиті
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Auth middleware error:', error);
//         res.status(403).json({ success: false, message: 'Invalid token or insufficient permissions' });
//     }
// };



const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '').trim();
        if (!token) {
            return res.status(401).json({ success: false, message: 'Токен авторизации отсутствует' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }

        // Сохраняем пользователя в объекте запроса
        req.user = user;
        next();
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        res.status(403).json({ success: false, message: 'Недопустимый токен или недостаточно прав' });
    }
};
