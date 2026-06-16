const Volunteer = require('../models/volunteer.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});












const createVolunteer = async (req, res) => {
    const { username, email, password, phone, role, skills, address, interests } = req.body;

    try{
        const isEmailExist = await Volunteer.findOne({email});
        if(isEmailExist){
            return res.status(400).json({message: 'Email already exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newVolunteer = await Volunteer.create({
            username,
            email,
            password: hashedPassword,
            phone,
            role,
            skills,
            address,
            interests
        })


        try {
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: "Volunteer Registration Successful",
                html: `
                    <h2>Hello ${username},</h2>
                    <p>Thank you for registering as a volunteer.</p>
                    <p>We will review your application and contact you soon.</p>
                `
            });
        } catch (emailError) {
            console.error("Failed to send volunteer welcome email:", emailError.message);
        }



        const token = jwt.sign({ id: newVolunteer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });



        return res.status(201).json({message: 'Volunteer created successfully',
             volunteer: newVolunteer});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal server error'});

    }}


const loginVolunteer = async (req,res)=>{
    const {email, password} = req.body;

    try{
        const isEmailExist = await Volunteer.findOne({email});
        if(!isEmailExist){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const isPasswordVaild = await bcrypt.compare(password, isEmailExist.password);
        if(!isPasswordVaild){
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const token = jwt.sign({ id: isEmailExist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        return res.status(200).json({message: 'Login successful', token});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal server error'});
    }
}










const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json({
            message: 'Profile retrieved successfully',
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    const { username, phone, skills, address, interests } = req.body;
    try {
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const updatedVolunteer = await Volunteer.findByIdAndUpdate(
            req.user._id,
            { username, phone, skills, address, interests },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedVolunteer
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating profile',
            error: error.message
        });
    }
};

module.exports = {
    createVolunteer,
    loginVolunteer,
    getProfile,
    updateProfile
}