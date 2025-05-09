const express=require('express');
const router=express.Router();
const usercontroller=require('../controller/user');

router.post('/user/signup',usercontroller.signup);

router.post('/user/login',usercontroller.login);

module.exports=router