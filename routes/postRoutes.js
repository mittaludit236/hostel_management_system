const express = require('express');
const postController = require('../controllers/postController');
const {requireAuthenticate,requireAuthenticate1}=require("../middleware/authentication");
const router = express.Router();
router.post("/query_page/:id",postController.postQueryPage);
router.post("/upvote/:id",postController.upvote);
router.post("/downvote/:id",postController.downvote);
router.post("/delete",postController.delete);
module.exports=router;