const express = require('express');
const { registerUser, login, passwordReset, resetpassword } = require('../controller/userController');

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',login);
router.post('/passwordreset',passwordReset);
router.post('/resetpassword/:token',resetpassword)

module.exports =router;