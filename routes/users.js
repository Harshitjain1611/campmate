const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchasync=require('../utils/catchasync');
const passport=require('passport');
const {Isloggedin,setreturnto}=require('../middleware');
const users=require('../controllers/user');

router.route('/register')
    .get(users.renderRegisterForm)

    .post(catchasync(users.registerForm));

router.route('/login')
    .get(users.renderLoginForm)

    .post(setreturnto,passport.authenticate('local',{failureFlash:true , failureRedirect: '/login'}),users.afterLogin);

router.get('/logout',users.renderLogout);

module.exports=router;