const Volunteer = require('../models/volunteer.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const createVolunteer = async (req, res) => {
    const { username, email, password, phone, role, skills, address, interests } = req.body;

    try {
        const isEmailExist = await Volunteer.findOne({ email });
        if (isEmailExist) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVolunteer = await Volunteer.create({
            username,
            email,
            password: hashedPassword,
            phone,
            role,
            skills,
            address,
            interests
        });

        const token = jwt.sign({ id: newVolunteer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

        try {
            await resend.emails.send({
                from: 'NayePankh Foundation <onboarding@resend.dev>',
                to: email,
                subject: 'Volunteer Registration Successful',
                html: `
                    <h2>Hello ${username},</h2>
                    <p>Thank you for registering as a volunteer.</p>
                    <p>We will review your application and contact you soon.</p>
                `
            });
        } catch (emailError) {
            console.error('Failed to send volunteer welcome email:', emailError.message);
        }

        return res.status(201).json({
            message: 'Volunteer created successfully',
            volunteer: newVolunteer
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const loginVolunteer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const isEmailExist = await Volunteer.findOne({ email });
        if (!isEmailExist) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, isEmailExist.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: isEmailExist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

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

const updateVolunteerStatus = async (req, res) => {
    const { id } = req.params;
    const { applicationStatus } = req.body;

    if (!['pending', 'selected', 'rejected'].includes(applicationStatus)) {
        return res.status(400).json({ message: 'Invalid status. Status must be pending, selected, or rejected.' });
    }

    try {
        const volunteer = await Volunteer.findById(id);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        volunteer.applicationStatus = applicationStatus;
        await volunteer.save();

        let emailSubject = '';
        let emailHtml = '';

        if (applicationStatus === 'selected') {
            emailSubject = 'Volunteer Application Status: Selected';
            emailHtml = `
                <h2>Hello ${volunteer.username},</h2>
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #334155; line-height: 1.6;">
                    <p>Congratulations! You have been selected as a volunteer at NayePankh Foundation.</p>
                    <p>Our team will contact you shortly with further details.</p>
                </div>
                <br>
                <p>Best regards,</p>
                <p><strong>NayePankh Foundation Team</strong></p>
            `;
        } else if (applicationStatus === 'rejected') {
            emailSubject = 'Volunteer Application Status Update';
            emailHtml = `
                <h2>Hello ${volunteer.username},</h2>
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #334155; line-height: 1.6;">
                    <p>Thank you for applying. Unfortunately, you were not selected at this time.</p>
                    <p>We appreciate your interest in NayePankh Foundation and wish you the best in your future endeavors.</p>
                </div>
                <br>
                <p>Best regards,</p>
                <p><strong>NayePankh Foundation Team</strong></p>
            `;
        }

        if (emailSubject && emailHtml) {
            try {
                await resend.emails.send({
                    from: 'NayePankh Foundation <onboarding@resend.dev>',
                    to: volunteer.email,
                    subject: emailSubject,
                    html: emailHtml
                });
                console.log(`Notification email sent to ${volunteer.email} for status: ${applicationStatus}`);
            } catch (emailError) {
                console.error('Failed to send status update email:', emailError.message);
            }
        }

        return res.status(200).json({
            message: `Volunteer status updated successfully to ${applicationStatus}`,
            volunteer: {
                _id: volunteer._id,
                username: volunteer.username,
                email: volunteer.email,
                applicationStatus: volunteer.applicationStatus
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error updating volunteer status',
            error: error.message
        });
    }
};

module.exports = {
    createVolunteer,
    loginVolunteer,
    getProfile,
    updateProfile,
    updateVolunteerStatus
};