const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const volunteerRoutes = require('./routes/volunteer.route');

const adminRoutes = require('./routes/admin.route')


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();



app.use('/volunteers', volunteerRoutes);

app.use('/admin', adminRoutes)

module.exports = app;