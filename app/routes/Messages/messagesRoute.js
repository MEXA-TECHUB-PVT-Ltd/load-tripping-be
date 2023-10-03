const express = require('express');
const router = express.Router();
const controller = require("../../controllers/MESSAGES/messagesController")

router.post("/createMessage" , controller.createMessages);
router.post("/readMessages" , controller.readMessages);
router.post("/getmsg", controller.getmsg);


router.post("/login" , controller.login);






module.exports = router;