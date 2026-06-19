const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const Volunteer = require('../models/volunteer.model');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/mailer');

const createAdmin = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({
                message: 'Admin already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: 'Admin created successfully',
            admin: newAdmin
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating admin',
            error: error.message
        });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Wrong password'
            });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

        res.status(200).json({
            message: 'Login successful',
            admin,
            token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
};

const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.status(200).json({
            message: 'Volunteers retrieved successfully',
            volunteers
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving volunteers',
            error: error.message
        });
    }
};

const mailVolunteer = async (req, res) => {
    const volunteerEmail = req.body.email;
    const { subject, message } = req.body;

    try {
        const volunteer = await Volunteer.findOne({ email: volunteerEmail });
        if (!volunteer) {
            return res.status(404).json({
                message: 'Volunteer not found'
            });
        }

        await sendEmail({
            to: volunteer.email,
            subject: subject || 'Welcome to NayePankh Foundation',
            html: message ? `
                <h2>Hello ${volunteer.username},</h2>
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #334155; line-height: 1.6;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                <br>
                <p>Best regards,</p>
                <p><strong>NayePankh Foundation Team</strong></p>
            ` : `
                <h2>Hello ${volunteer.username},</h2>
                <p>Thank you for registering as a volunteer.</p>
                <p>We are excited to have you with us!</p>
            `
        });

        res.status(200).json({
            message: 'Email sent successfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error sending email',
            error: error.message
        });
    }
};

const getVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id).select('-password');
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        res.status(200).json({
            message: 'Volunteer retrieved successfully',
            volunteer
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving volunteer details',
            error: error.message
        });
    }
};

const deleteVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        res.status(200).json({
            message: 'Volunteer deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting volunteer',
            error: error.message
        });
    }
};

module.exports = {
    createAdmin,
    loginAdmin,
    getAllVolunteers,
    mailVolunteer,
    getVolunteerById,
    deleteVolunteer
};