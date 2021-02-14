const express = require("express");

const Router = express.Router();

const Post = require("../models/Post");
const { verifyUser } = require("../middlewares/auth");

// multer middleware for file upload
const { postUpload } = require("../middlewares/photoUpload");

const {
	postAddPost,
	putUpdatePost,
	deletePost,
} = require("../controllers/post");

Router.post("/", verifyUser, postUpload.single("image"), postAddPost);
Router.put("/:id", verifyUser, putUpdatePost);
Router.delete("/:id", verifyUser, deletePost);

module.exports = Router;
