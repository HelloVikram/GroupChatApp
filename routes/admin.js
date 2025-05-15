const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authenticate');
const admincontroller=require('../controller/admin');


router.post('/promoteToAdmin',authenticate.authenticate,admincontroller.promoteToAdmin);
router.post('/removeUser',authenticate.authenticate,admincontroller.removeUser);
router.post('/removeAdmin',authenticate.authenticate,admincontroller.removeAdmin)
router.get('/groupmembers',authenticate.authenticate,admincontroller.groupmembers);
router.post('/addmembers',authenticate.authenticate,admincontroller.addmembers);
module.exports=router;