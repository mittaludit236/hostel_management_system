const express = require('express');
const authController = require('../controllers/authController');
const {requireAuthenticate,requireAuthenticate1}=require("../middleware/authentication");
const router = express.Router();
router.get('/', authController.getHomePage);
router.get("/signup",authController.getSignUpPage);
router.get("/signin_admin",authController.getSignInaPage);
router.get("/signin_student",authController.getSignInPage);
router.get("/success",authController.getSuccessPage);
router.get("/failure_email",authController.getFEPage);
router.get("/failure_password",authController.getFPPage);
// Route for starting the Google OAuth flow
router.get('/google', authController.googleAuth);

// Route for handling the callback from Google after OAuth flow
router.get('/google/callback', authController.googleAuthCallback);
router.get("/logout",requireAuthenticate,authController.logout);
router.post("/signup",authController.postSignUpPage);
router.post("/signin_student",authController.postSignInPage);
router.post("/signin_admin",authController.postSignInAPage);
// router.post('/signup', authController.postSignup);
// router.get('/signin', authController.getSigninPage);
// router.post('/signin', authController.postSignin);

// Define other routes...

module.exports = router;