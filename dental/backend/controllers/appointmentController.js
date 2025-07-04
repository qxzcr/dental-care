const Appointment = require('../models/Appointment');
const { User } = require('../models/User');
const mongoose = require('mongoose');

exports.getAppointments = async (req, res) => {
    try {
        const { role, _id } = req.user;
        let filter = {};

        if (role === 'patient') filter.patientId = _id;
        else if (role === 'doctor') filter.doctorId = _id;

        const appointments = await Appointment.find(filter)
            .populate('patientId', 'imie nazwisko email')
            .populate('doctorId', 'imie nazwisko email');

        res.json({ success: true, data: appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ success: false, message: 'Błąd pobierania wizyt' });
    }
};

exports.createAppointment = async (req, res) => {
    const { patientId, doctorId, date, time, message } = req.body;

    if (!patientId || !doctorId || !date || !time) {
        return res.status(400).json({ success: false, message: 'Wszystkie pola są wymagane!' });
    }

    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);
    if (!patient || !doctor) {
        return res.status(400).json({ success: false, message: 'Неправильні дані: пацієнт або лікар' });
    }

    try {
        const appointment = new Appointment({ patientId, doctorId, date, time, message });
        const newAppointment = await appointment.save();
        res.status(201).json({ success: true, data: newAppointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ success: false, message: 'Błąd przy tworzeniu wizyty' });
    }
};