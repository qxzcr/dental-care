const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    to: { type: String, required: true },
    from: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    isAdminResponse: { type: Boolean, default: false }, // Нове поле
});

module.exports = mongoose.model('Message', messageSchema);