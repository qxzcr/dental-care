const Joi = require('joi');

const createAppointmentSchema = Joi.object({
    doctorId: Joi.string().required(),
    date: Joi.date().iso().required(),
    time: Joi.string().required(),
    procedure: Joi.string().required(),
    description: Joi.string().allow('', null),
});

const updateAppointmentSchema = Joi.object({
    date: Joi.date().iso(),
    time: Joi.string(),
    procedure: Joi.string(),
    description: Joi.string().allow('', null),
}).min(1);

module.exports = {
    createAppointmentSchema,
    updateAppointmentSchema,
};