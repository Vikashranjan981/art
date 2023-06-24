const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const passport=require('passport');
const users=require('../controllers/users');
const { storeReturnTo } = require('../middleware');

router.route('/register')
        .get(users.renderRegister)
        .post(catchAsync(users.register));


router.route('/login')
        .get(users.renderLogIn)
        .post(storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)






router.get('/logout', users.logout); 

module.exports=router;