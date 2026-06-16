const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:3,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:6
    },
    password:{type:String,
        required:true
    },
    role:{
        type:String,
        enum:['volunteer','admin'],
        default:'admin'
    },
    status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under-review'],
    default: 'pending'
}
})

const Admin = mongoose.model('Admin',adminSchema)

module.exports = Admin