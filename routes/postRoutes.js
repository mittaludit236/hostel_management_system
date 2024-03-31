const express = require('express');
const postController = require('../controllers/postController');
const {requireAuthenticate,requireAuthenticate1}=require("../middleware/authentication");
const router = express.Router();
router.post("/query_page/:id",postController.postQueryPage);
router.post("/upvote/:id",postController.upvote);
router.post("/downvote/:id",postController.downvote);
router.post("/delete",postController.delete);


router.post("/send_reminder/:id",postController.sendReminder);

router.post("/resolve-post/:id", postController.ResolveMail);
router.get('/posts/:postId/',postController.getEditPost);
router.post('/posts/edit/:postId/:userId',postController.postEdit);
router.get("/get_post_content/:id",postController.getPM);
router.post("/yes/:id",postController.postYes);
router.post("/no/:id",postController.postNo);
router.post("/delete-post/:id", postController.DeletePost);
module.exports=router;