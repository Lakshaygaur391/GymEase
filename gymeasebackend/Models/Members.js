const mongoose = require('mongoose');
const membership_modal = require('./membership');
require('dotenv').config();
const MembersSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Phone_Number: {
        type: Number,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    membership:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'membership',
        required: true
    },
    gym:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gym',
        required: true
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    lastPaymentDate:{
        type: Date,
        default: Date.now,
        required: true
    },
    nextPaymentDueDate:{
        type: Date,
        required: true
    },
    ProfilePic:{
        type: String,
        default: "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
    }

},{timestamps: true});

const Members_Modal=mongoose.model("Members",MembersSchema);

module.exports=Members_Modal;