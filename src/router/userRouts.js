const express = require('express');
const UserRouter = express.Router();

const {registerUser,loginUser,forgotPassword,verifyPassword,captchaData} = require('../controller/userController');

UserRouter.route('/register')
.post(registerUser);

UserRouter.route('/captcha')
.get(captchaData);

UserRouter.route('/login')
.post(loginUser);

UserRouter.route('/forgotPassword')
.post(forgotPassword);

UserRouter.route('/verifyPassword')
.post(verifyPassword);



module.exports = UserRouter;