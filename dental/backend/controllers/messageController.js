const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    const { content, to } = req.body;

    if (!content || !to) {
        return res.status(400).json({ success: false, message: 'Pole treści i odbiorcy są wymagane' });
    }

    try {
        const message = new Message({
            content,
            from: req.user.email,
            to,
            isAdminResponse: req.user.role === 'admin',
        });
        await message.save();
        res.status(201).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Błąd przy wysyłaniu wiadomości' });
    }
};
//
// exports.getMessages = async (req, res) => {
//     try {
//         const messages = await Message.find({ to: req.user.email });
//         res.json({ success: true, data: messages });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Błąd przy pobieraniu wiadomości' });
//     }
// };
exports.getMessages = async (req, res) => {
    try {
        const emails = [req.user.email]; // Поточний користувач (email)

        // Якщо користувач - адміністратор, він бачить усі повідомлення
        if (req.user.role === 'admin') {
            const messages = await Message.find().sort({ date: -1 });
            return res.json({ success: true, data: messages });
        }

        // Якщо користувач - пацієнт, він бачить лише свої повідомлення
        const messages = await Message.find({
            $or: [{ from: req.user.email }, { to: req.user.email }],
        }).sort({ date: -1 });

        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('Błąd podczas pobierania wiadomości:', error);
        res.status(500).json({ success: false, message: 'Nie udało się pobrać wiadomości.' });
    }
};