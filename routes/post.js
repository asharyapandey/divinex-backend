const express = require("express");

const Router = express.Router();

const { verifyUser } = require("../middlewares/auth");
const Post = require("../models/Post");

Router.post("/", verifyUser, async (req, res) => {
	try {
		const { caption, image } = req.body;
		const post = new Post({ caption, image });
		await post.save();
		return res.status(200).json(post);
	} catch (error) {
		console.log(error);
		return res.send("yeta error");
	}
});

module.exports = Router;
