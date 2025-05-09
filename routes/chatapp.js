const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authenticate');
const chatcontroller=require('../controller/chatapp');

router.post('/message',authenticate.authenticate,chatcontroller.messages);
router.get('/getmessages',authenticate.authenticate,chatcontroller.getmessages);
module.exports=router;