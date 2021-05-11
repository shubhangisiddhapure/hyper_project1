const Joi = require('@hapi/joi')


function validateObj(obj, schema) {
    let result = null
    Joi.validate(obj, schema, (err, data) => {
        if (err) {
            result = [false, err]
        }
        else {
            result = [true, data]
        }
    })
    return result
}

function busValidation(bus) {
  
    const busSchema = Joi.object().keys({
    busNumber:  Joi.string().required(true).max(10),
    numberOfseats: Joi.number().min(1).max(40).required(true),
    name: Joi.string().max(6).required(true),
    endCity: Joi.string().required(true),
    startCity: Joi.string().required(true),
    description:Joi.string().max(10).required(true),
    arrivalDate:Joi.date().optional(),
    departureDate:Joi.date().optional(),
    departureTiming: Joi.date().optional(),
    arrivalTiming:Joi.date().optional()
    })
    return validateObj(bus,busSchema)
}

module.exports = {
    busValidation: busValidation,
}