const Service = require('../models/Service');

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera przy pobieraniu usług' });
    }
};

exports.createService = async (req, res) => {
    const { title, description, price } = req.body;
    try {
        const service = new Service({ title, description, price });
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: 'Błąd przy tworzeniu usługi' });
    }
};