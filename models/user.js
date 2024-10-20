const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: String,
    resetTokenExpire: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
