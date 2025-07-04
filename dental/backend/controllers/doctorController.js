const Doctor = require('../models/Doctor');

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera przy pobieraniu lekarzy' });
    }
};

exports.createDoctor = async (req, res) => {
    const { imie, nazwisko, specialty, description, photo } = req.body;
    try {
        const doctor = new Doctor({ imie, nazwisko, specialty, description, photo });
        await doctor.save();
        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ message: 'Błąd przy tworzeniu lekarza' });
    }
};