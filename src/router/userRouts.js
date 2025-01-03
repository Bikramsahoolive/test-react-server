const express = require('express');
const UserRouter = express.Router();

const {registerUser,loginUser} = require('../controller/userController');

UserRouter.route('/register')
.post(registerUser);

UserRouter.route('/login')
.post(loginUser);


module.exports = UserRouter;