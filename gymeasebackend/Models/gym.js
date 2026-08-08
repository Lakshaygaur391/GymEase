const mongoose = require('mongoose');
const gymSchema = new mongoose.Schema({
     email: {   
        type: String,
        required: true,
        unique: true
    },
    Gym_Name: { 
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true 
    },
    Password: {
        type: String,
        required: true,
    },
    Profilepic:{
        type: String,
       
    },
    resetPasswordToken:{
        type: String,
    },

    resetPasswordExpires:{
        type: Date,
    }


},{timestamps: true});     

const gym_modal = mongoose.model('gym', gymSchema);

module.exports = gym_modal;