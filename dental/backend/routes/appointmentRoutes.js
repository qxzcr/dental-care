const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment'); // Модель приема
const { User } = require('../models/User'); // Модель пользователя

// Создание нового приема (только пациент)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { doctorId, date, time, message } = req.body;

        if (req.user.role !== 'patient') {
            return res.status(403).json({ success: false, message: 'Brak uprawnień' });
        }

        const appointment = new Appointment({
            patientId: req.user._id,
            doctorId,
            date,
            time,
            message: message || '',
        });

        await appointment.save();
        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('patientId', 'imie nazwisko email')
            .populate('doctorId', 'imie nazwisko email');
        res.status(201).json({ success: true, data: populatedAppointment });
    } catch (error) {
        console.error('Błąd tworzenia wizyty:', error);
        res.status(500).json({ success: false, message: 'Błąd przy tworzeniu wizyty' });
    }
});

// Получение списка приемов (только для соответствующих ролей)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { role, _id } = req.user;
        let filter = {};

        if (role === 'patient') {
            filter.patientId = _id;
        } else if (role === 'doctor') {
            filter.doctorId = _id;
        }

        const appointments = await Appointment.find(filter)
            .populate('patientId', 'imie nazwisko email')
            .populate('doctorId', 'imie nazwisko email');

        res.json({ success: true, data: appointments });
    } catch (error) {
        console.error('Błąd pobierania wizyt:', error);
        res.status(500).json({ success: false, message: 'Błąd pobierania wizyt' });
    }
});

// Обновление записи (только админ или доктор)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, message } = req.body;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Wizyta nie została znaleziona' });
        }

        if (req.user.role !== 'admin' && appointment.doctorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Brak uprawnień' });
        }

        appointment.date = date || appointment.date;
        appointment.time = time || appointment.time;
        appointment.message = message || appointment.message;
        await appointment.save();

        const updatedAppointment = await Appointment.findById(id)
            .populate('patientId', 'imie nazwisko email')
            .populate('doctorId', 'imie nazwisko email');

        res.json({ success: true, data: updatedAppointment });
    } catch (error) {
        console.error('Błąd przy aktualizacji wizyty:', error);
        res.status(500).json({ success: false, message: 'Błąd przy aktualizacji wizyty' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Wizyta nie została znaleziona' });
        }

        if (req.user.role !== 'admin' && appointment.doctorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Brak uprawnień' });
        }


        await Appointment.findByIdAndDelete(id);

        res.json({ success: true, message: 'Wizyta została usunięta.' });
    } catch (error) {
        console.error('Błąd przy usuwaniu wizyty:', error);
        res.status(500).json({ success: false, message: 'Błąd przy usuwaniu wizyty' });
    }
});
module.exports = router;