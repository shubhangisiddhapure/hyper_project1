const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const BusSchema = new mongoose.Schema({
    busNumber: {
        type:String,
        unique:true,
        required:true
    },
    numberOfseats:{
        type:Number,
        required:true,
        max:40
    },    
    name:{
        type:String,
        required:true
    },
    startCity:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    endCity:{
        type:String,
        required:true
    },
    arrivalDate: {
        type:Date,
        default:Date.now()
    },
    departureDate:{
        type:Date,
        default:Date.now()
    },
    departureTiming: {
        type:Date ,
        default:Date.now()
    },
    arrivalTiming:{
        type:Date,
        default:Date.now()
    }
},
{
    timestamps: true
});

BusSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: 'Error, expected {PATH} to be unique.'
});


module.exports = mongoose.model('Bus', BusSchema);

