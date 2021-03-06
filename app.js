require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

// Connect to Database
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ', process.env.MONGODB_URI)
});

// On Error 
mongoose.connection.on('error', (err) => {
    console.log('Database error ', err)
});

const app = express();

const users = require('./routes/users');

// Setup for Heroku host
const port = process.env.PORT;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express JSON Body-parser Middleware
app.use(express.json({ limit: '2mb', extended: true}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Import Users Routes
app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
    console.log('Server started on port', port);
});