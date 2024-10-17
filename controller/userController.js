const express = require('express');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// User Registration
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(401).json({ message: 'Email already exists, try another' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error registering user",error.message)
        res.status(500).json({ message: 'Error registering user' });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Email not found, try another" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ message: "Invalid password" });

        res.json({ message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};


// Password Reset Request
exports.passwordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email not found" });
        }

        const resetToken = uuidv4();
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // Setup nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'login',
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // Your Gmail password or App Password if 2-Step is enabled
            },
        });

        const resetLink = `${process.env.REACT_URI}/resetpassword/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,  // Sender address
            to: email,  // List of receivers
            subject: 'Reset Your Password',  // Subject line
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,  // HTML body
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error.message);
                return res.status(500).json({ message: 'Error sending reset email' });
            }
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: 'Password reset request sent successfully' });
        });
    } catch (error) {
        console.error('Error during password reset:', error.message);
        res.status(500).json({ message: 'Error sending reset email' });
    }
};


// Password Reset
exports.resetpassword = async (req, res) => {
    const { token } = req.params;
    const { newpassword } = req.body;
    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } });
        console.log('Received token:', token);
        if (!user) {
            console.log('Invalid or expired token');
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password' });
    }
};

