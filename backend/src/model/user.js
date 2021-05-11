const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema =new mongoose.Schema({
   
    name: 
    {
        type: String,
        required:true
    },
    lastName:
    {
        type: String
    },
    gender: 
    {
        type:String,
        required:true
    },
    age:
    {
        type:Number
    },
    phoneNo:
    { 
        type: Number, 
    },
    email:
    { 
        type: String, 
        unique:true,
        required:true 
    },
    password:
    {
        type:String,
        required:true
    },
    isAdmin: 
    {
        type: Boolean,
        required:true,
        default: false
    }
},
{
    timestamps: true
});
UserSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: 'Error, expected {PATH} to be unique.'
});
module.exports = mongoose.model('User', UserSchema);
