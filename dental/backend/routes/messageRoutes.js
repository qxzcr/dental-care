// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const Message = require('../models/Message');
//
// // Отримання повідомлень
// router.get('/', authMiddleware, async (req, res) => {
//     try {
//         if (!req.user || !req.user.email) {
//             return res.status(401).json({ success: false, message: 'Nieautoryzowany dostęp!' });
//         }
//
//         const messages = await Message.find({
//             $or: [{ to: req.user.email }, { from: req.user.email }],
//         }).sort({ date: -1 });
//
//         res.json({ success: true, data: messages });
//     } catch (error) {
//         console.error('Błąd podczas pobierania wiadomości:', error);
//         res.status(500).json({ success: false, message: 'Nie udało się pobrać wiadomości.' });
//     }
// });
//
// // Відправлення повідомлення
// router.post('/', authMiddleware, async (req, res) => {
//     const { content, to } = req.body;
//
//     if (!content || !to) {
//         return res.status(400).json({ success: false, message: 'Treść wiadomości i odbiorca są wymagane.' });
//     }
//
//     try {
//         if (!req.user || !req.user.email) {
//             return res.status(401).json({ success: false, message: 'Nieautoryzowany dostęp!' });
//         }
//
//         const message = new Message({
//             content,
//             from: req.user.email,
//             to,
//             date: new Date(),
//         });
//
//         await message.save();
//         res.status(201).json({ success: true, message: 'Wiadomość wysłana pomyślnie.', data: message });
//     } catch (error) {
//         console.error('Błąd podczas wysyłania wiadomości:', error);
//         res.status(500).json({ success: false, message: 'Nie udało się wysłać wiadomości.' });
//     }
// });
//
// module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messageController');

// Отримання повідомлень (як для адміністратора, так і для пацієнта)
router.get('/', authMiddleware, getMessages);

// Відправлення повідомлення
router.post('/', authMiddleware, sendMessage);

module.exports = router;