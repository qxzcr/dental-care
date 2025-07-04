const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true }, // Changed to String to match frontend format (e.g., "150-300 PLN")
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);