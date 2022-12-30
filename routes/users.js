const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');
const { nextTick } = require('process');
const { register } = require('../models/user');
const { executionAsyncResource } = require('async_hooks');

const users = require('../controllers/users');

//Register Page
router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.register))

//Login Page
router.get('/login', users.renderLogin)

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}),users.login)


//Logout
router.get('/logout', users.logout)
module.exports = router;
