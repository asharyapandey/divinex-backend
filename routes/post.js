const express = require("express");

const Router = express.Router();

const { verifyUser } = require("../middlewares/auth");

// multer middleware for file upload
const { postUpload } = require("../middlewares/photoUpload");

const {
	getPost,
	postAddPost,
	putUpdatePost,
	deletePost,
	getComments,
	postComments,
	putComments,
	deleteComments,
	postLike,
	deleteLike,
	getFeed,
	getPostById,
	getExplorePosts,
} = require("../controllers/post");

// get users post
Router.get("/", verifyUser, getPost);
Router.post("/", verifyUser, postUpload.single("image"), postAddPost);
Router.put("/:id", verifyUser, postUpload.single("image"), putUpdatePost);
Router.delete("/:id", verifyUser, deletePost);

// get news feed
Router.get("/feed", verifyUser, getFeed);

// get explore posts
Router.get("/explore", verifyUser, getExplorePosts);

// routes to like and dislike post
Router.post("/like/:postId", verifyUser, postLike);
Router.delete("/unlike/:postId", verifyUser, deleteLike);

// Routes for comments
Router.get("/comment/:id", verifyUser, getComments);
Router.post("/comment/:id", verifyUser, postComments);
Router.put("/comment/:commentId", verifyUser, putComments);
Router.delete("/comment/:commentId", verifyUser, deleteComments);

// getting post by id
Router.get("/user/:id", verifyUser, getPostById);

module.exports = Router;
