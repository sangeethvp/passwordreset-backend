const express = require('express');
const { registerUser, login, passwordReset, resetpassword, getUserinfo } = require('../controller/userController');

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',login);
router.post('/passwordreset',passwordReset);
router.post('/resetpassword/:token',resetpassword);
router.get('/info',getUserinfo)

module.exports =router;