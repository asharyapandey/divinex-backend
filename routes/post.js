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
} = require("../controllers/post");

Router.get("/", verifyUser, getPost);
Router.post("/", verifyUser, postUpload.single("image"), postAddPost);
Router.put("/:id", verifyUser, putUpdatePost);
Router.delete("/:id", verifyUser, deletePost);

// Routes for comments
Router.get("/comment/:id", verifyUser, getComments);
Router.post("/comment/:id", verifyUser, postComments);
Router.put("/comment/:id", verifyUser, putComments);
Router.delete("/comment/:id", verifyUser, deleteComments);

module.exports = Router;
