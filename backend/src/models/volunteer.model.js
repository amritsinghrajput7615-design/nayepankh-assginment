const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['volunteer', 'admin'],
        default: 'volunteer',
    },
    skills:{
        type: [String],
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    interests: {
        type: [String],
        required: true,}
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;