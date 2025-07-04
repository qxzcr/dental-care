const User = require('../models/User');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const validateUser = (user) => {
    const schema = Joi.object({
        imie: Joi.string().required(),
        nazwisko: Joi.string().required(),
        email: Joi.string().email().required(),
        haslo: Joi.string().min(8).required(),
        role: Joi.string().valid('admin', 'doctor', 'patient').required(),
        specialty: Joi.string().when('role', {
            is: 'doctor',
            then: Joi.required(),
            otherwise: Joi.optional().allow('')
        })
    });
    return schema.validate(user);
};

exports.register = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        console.error('Validation error:', error.details);
        return res.status(400).json({ message: error.details[0].message });
    }

    const { imie, nazwisko, email, haslo, role, specialty } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Użytkownik z tym adresem email już istnieje' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(haslo, salt);

    user = new User({ imie, nazwisko, email, haslo: hashedPassword, role, specialty: role === 'doctor' ? specialty : undefined });
    try {
        await user.save();
        console.log('User saved successfully:', { email: user.email, role: user.role });
    } catch (err) {
        console.error('Save error:', err);
        return res.status(500).json({ message: 'Błąd podczas zapisywania użytkownika', error: err.message });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Użytkownik zarejestrowany pomyślnie', token, user: { name: user.imie, role: user.role, id: user._id } });
};

exports.login = async (req, res) => {
    const { email, haslo } = req.body;
    if (!email || !haslo) {
        return res.status(400).json({ message: 'Email i hasło są wymagane' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Nieprawidłowy email lub hasło' });
    const validPassword = await bcrypt.compare(haslo, user.haslo);
    if (!validPassword) return res.status(400).json({ message: 'Nieprawidłowy email lub hasło' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Zalogowano pomyślnie!', token, user: { name: user.imie, role: user.role, id: user._id } });
};