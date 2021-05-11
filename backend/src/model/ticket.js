const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const TicketSchema = new mongoose.Schema({
      
    seatNo:{ 
        type:Number, 
        max:40
    },
    isBooked: { 
        type: Boolean, 
        default:false
    },
    costOfticket:{
        type:Number,
        require:true
    },
    userId:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User',
        require:true,
    },
    busId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bus',
        require:true,
    },
    passenger:{
        name:{
            type: String, 
        },
        gender:{
            type:String,
        },
        age: {
            type:Number
        },
        phoneNo:{ 
            type: Number,
        },
        email:{ 
            type: String,
        },
    }
    
},
{
    timestamps: true
});
TicketSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: 'Error, expected {PATH} to be unique.'
});


module.exports = mongoose.model('Ticket', TicketSchema);     
