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

function ticketValidation(ticket) {
  
    const ticketSchema = Joi.object().keys({
   
    seatNo: Joi.number().max(40).optional(),
    isBooked: Joi.boolean().default(false),
    costOfticket:Joi.number().required(true),
    userId:Joi.string().optional(),
    busId:Joi.string().required(true),
    })
    return validateObj(ticket,ticketSchema)
}

module.exports = {
    ticketValidation: ticketValidation,
}