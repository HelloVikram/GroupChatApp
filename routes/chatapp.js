const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authenticate');
const chatcontroller=require('../controller/chatapp');
const upload = require('../middleware/multer');

router.post('/upload',authenticate.authenticate, upload.single('file'), chatcontroller.upLoad);
router.post('/message',authenticate.authenticate,chatcontroller.messages);
router.get('/getusers',authenticate.authenticate,chatcontroller.getUsers);
router.get('/getmessages',authenticate.authenticate,chatcontroller.getmessages);
module.exports=router;