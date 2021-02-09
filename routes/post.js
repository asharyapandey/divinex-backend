const express = require("express");

const Router = express.Router();

const Post = require("../models/Post");
const { verifyUser } = require("../middlewares/auth");

const {
	postAddPost,
	putUpdatePost,
	deletePost,
} = require("../controllers/post");

Router.post("/", verifyUser, postAddPost);
Router.put("/:id", verifyUser, putUpdatePost);
Router.delete("/:id", verifyUser, deletePost);

module.exports = Router;
