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
} = require("../controllers/post");

Router.get("/", verifyUser, getPost);
Router.post("/", verifyUser, postUpload.single("image"), postAddPost);
Router.put("/:id", verifyUser, putUpdatePost);
Router.delete("/:id", verifyUser, deletePost);

// routes to like and dislike post
Router.post("/like/:postId", verifyUser, postLike);
Router.delete("/unlike/:postId", verifyUser, deleteLike);

// Routes for comments
Router.get("/comment/:id", verifyUser, getComments);
Router.post("/comment/:id", verifyUser, postComments);
Router.put("/comment/:commentId", verifyUser, putComments);
Router.delete("/comment/:commentId", verifyUser, deleteComments);

module.exports = Router;
