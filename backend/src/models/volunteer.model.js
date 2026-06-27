const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
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
        required: true,
    },
    applicationStatus: {
        type: String,
        enum: ['pending', 'selected', 'rejected'],
        default: 'pending'
    },
    assignedTask: {
    title: { type: String },
    description: { type: String },
    deadline: { type: Date },
    assignedAt: { type: Date }
}
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;