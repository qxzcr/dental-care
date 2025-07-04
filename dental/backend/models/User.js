// models/User.js
const mongoose = require('mongoose');
const Joi = require('joi');

// Опис схеми для Mongoose
const userSchema = new mongoose.Schema({
    imie: { type: String, required: true, minlength: 2, maxlength: 50 },
    nazwisko: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    haslo: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' },
    specialty: { type: String, default: '' }
}, { timestamps: true }); // Додає поля createdAt і updatedAt

// Перевірка входних даних через Joi
const validateUser = (user) => {
    const schema = Joi.object({
        imie: Joi.string().min(2).max(50).required(),
        nazwisko: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        haslo: Joi.string().min(8).required(),
        role: Joi.string().valid('admin', 'doctor', 'patient'),
        specialty: Joi.string().allow('')
    });
    return schema.validate(user);
};

// Експорт моделі та функції валідації
const User = mongoose.model('User', userSchema);
module.exports = { User, validateUser };
