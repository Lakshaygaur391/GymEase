const mongoose = require('mongoose');
require('dotenv').config();

const membershipSchema=new mongoose.Schema({
    No_of_Months:{
        type:Number,
        required:true
    },
    Price:{
        type:Number,
        required:true
    },
    gym:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'gym',
        required:true
    }
})

const membership_modal=mongoose.model('membership',membershipSchema);

module.exports=membership_modal;