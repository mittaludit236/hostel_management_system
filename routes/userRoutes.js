const express = require('express');
const userController = require('../controllers/userController');
const { requireAuthenticate, requireAuthenticate1 } = require("../middleware/authentication");
const router = express.Router();

// Existing routes
router.get("/query_page/:id", requireAuthenticate, userController.getQueryPage);
router.get("/admin_page", requireAuthenticate1, userController.getAdminPage);
router.post("/", userController.postContact);
router.get("/forget", userController.getForgetPage);
router.post("/forget", userController.postForgetPage);
router.get("/reset/:id", userController.getResetPage);
router.post("/reset/:id", userController.postResetPage);
router.get("/my_queries/:id", userController.getPersonalQueriesPage);
router.post("/increment-notification/:id", userController.Increment);

router.get("/notification-count/:id", userController.getCount);
module.exports = router;
