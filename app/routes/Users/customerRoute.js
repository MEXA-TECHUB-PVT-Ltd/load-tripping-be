const express = require('express');
const router = express.Router();
const controller = require("../../controllers/USERS/customerController")

router.post("/register" , controller.registerCustomer);
router.post("/getAllUsers", controller.getAllCustomers);
router.post("/adminGetAllusers", controller.admingetAllCustomers);
router.post("/updateUsername" , controller.updateUsername);
router.post("/verifyEmail" , controller.verifyEmail);
router.post("/getUserByUniqId" , controller.getUserByUniqId);




router.post("/login" , controller.login);
router.post("/logout" , controller.logout);








module.exports = router;