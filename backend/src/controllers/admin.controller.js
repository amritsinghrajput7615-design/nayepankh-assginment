const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const Volunteer = require('../models/volunteer.model');
const nodemailer = require("nodemailer");




const createAdmin = async (req,res)=>{
    const {username,email,password,role} = req.body;

    try{
        const admin = await Admin.findOne({email})
        if(admin){
            return res.status(400).json({
                message: 'Admin already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            role
        })
        res.status(201).json({
            message: 'Admin created successfully',
            admin: newAdmin
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error creating admin',
            error: error.message
        })
    }
}

const loginAdmin = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const admin = await Admin.findOne({email})
        if(!admin){
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }
        const isMatch = await bcrypt.compare(password, admin.password)
        if(!isMatch){
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }
        res.status(200).json({
            message: 'Login successful',
            admin
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        })
    }
}

const getAllVolunteers = async (req,res)=>{
    try{
        const volunteers = await Volunteer.find()
        res.status(200).json({
            message: 'Volunteers retrieved successfully',
            volunteers
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving volunteers',
            error: error.message
        })
    }
}



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

const mailVolunteer = async (req, res) => {
  const volunteerEmail = req.body.email;

  try {
    const volunteer = await Volunteer.findOne({ email: volunteerEmail });

    if (!volunteer) {
      return res.status(404).json({
        message: "Volunteer not found",
      });
    }

    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: volunteer.email,
      subject: "Welcome to NayePankh Foundation",
      html: `
        <h2>Hello ${volunteer.username}</h2>
        <p>Thank you for registering as a volunteer.</p>
        <p>We are excited to have you with us!</p>
      `,
    });

    res.status(200).json({
      message: "Email sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error sending email",
      error: error.message,
    });
  }
};



module.exports = {
    createAdmin,
    loginAdmin,
    getAllVolunteers,
    mailVolunteer
}