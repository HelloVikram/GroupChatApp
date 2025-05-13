const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authenticate');
const chatcontroller=require('../controller/groupchat');

router.post('/creategroup',authenticate.authenticate,chatcontroller.creategroup);
router.post('/groupmessages',authenticate.authenticate,chatcontroller.groupmessages);
router.get('/groupsadded',authenticate.authenticate,chatcontroller.groupsadded);
router.get('/getgroupmessages',authenticate.authenticate,chatcontroller.getgroupmessages);
module.exports=router;