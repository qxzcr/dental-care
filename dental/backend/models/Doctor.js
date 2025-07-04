// const mongoose = require('mongoose');
// const Joi = require('joi');
//
// const doctorSchema = new mongoose.Schema({
//     imie: { type: String, required: true, minlength: 2, maxlength: 50 },
//     nazwisko: { type: String, required: true, minlength: 2, maxlength: 50 },
//     email: { type: String, required: true, unique: true, match: /@doktor\.pl$/ },
//     haslo: { type: String, required: true },
//     specialty: { type: String }
// });
//
// const validateDoctor = (doctor) => {
//     const schema = Joi.object({
//         imie: Joi.string().min(2).max(50).required(),
//         nazwisko: Joi.string().min(2).max(50).required(),
//         email: Joi.string().email().regex(/@doktor\.pl$/).required(),
//         haslo: Joi.string().min(8).required(),
//         specialty: Joi.string().allow('')
//     });
//     return schema.validate(doctor);
// };
//
// const Doctor = mongoose.model('Doctor', doctorSchema);
// module.exports = { Doctor, validateDoctor };

const mongoose = require('mongoose');
const Joi = require('joi');

// Схема для лікаря
const doctorSchema = new mongoose.Schema({
    imie: { type: String, required: true, minlength: 2, maxlength: 50 },
    nazwisko: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, match: /@doctor\.pl$/ },
    role: { type: String, default: "doctor" },
    specialty: { type: String, required: true },
    photo: { type: String, default: "/images/default.jpg" }, // Дефолтне фото
}, { timestamps: true });

// Для валідації (Joi) на рівні API
const validateDoctor = (doctor) => {
    const schema = Joi.object({
        imie: Joi.string().min(2).max(50).required(),
        nazwisko: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().regex(/@doctor\.pl$/).required(),
        specialty: Joi.string().required(),
        photo: Joi.string()
    });
    return schema.validate(doctor);
};

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = { Doctor, validateDoctor };
