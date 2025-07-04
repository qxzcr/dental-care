const mongoose = require('mongoose');
const Joi = require('joi');

const patientSchema = new mongoose.Schema({
    imie: { type: String, required: true, minlength: 2, maxlength: 50 },
    nazwisko: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    haslo: { type: String, required: true }
});

const validatePatient = (patient) => {
    const schema = Joi.object({
        imie: Joi.string().min(2).max(50).required(),
        nazwisko: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        haslo: Joi.string().min(8).required()
    });
    return schema.validate(patient);
};

const Patient = mongoose.model('Patient', patientSchema);
module.exports = { Patient, validatePatient };