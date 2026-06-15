const express = require('express');
const connectDB = require('./config/db');
const volunteerRoutes = require('./routes/volunteer.route');

const adminRoutes = require('./routes/admin.route')


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();



app.use('/volunteers', volunteerRoutes);

app.use('/admin', adminRoutes)

module.exports = app;