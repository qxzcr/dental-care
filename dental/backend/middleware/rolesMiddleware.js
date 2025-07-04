module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.user;
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ success: false, message: 'Доступ заборонено!' });
        }
        next();
    };
};

// module.exports = (...allowedRoles) => {
//     return (req, res, next) => {
//         const { role } = req.user; // Витягуємо роль з токена
//         if (!allowedRoles.includes(role)) {
//             return res.status(403).json({ success: false, message: 'You do not have permission to access this resource!' });
//         }
//         next();
//     };
// };