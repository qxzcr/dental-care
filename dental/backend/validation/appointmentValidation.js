const Joi = require('joi');

const createAppointmentSchema = Joi.object({
    doctor: Joi.string().required(),
    date: Joi.date().iso().required(),
    notes: Joi.string().allow('', null),
});

const updateAppointmentSchema = Joi.object({
    date: Joi.date().iso(),
    notes: Joi.string().allow('', null),
}).min(1);

module.exports = {
    createAppointmentSchema,
    updateAppointmentSchema,
};
