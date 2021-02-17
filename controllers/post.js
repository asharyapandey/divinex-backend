const Post = require("../models/Post");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

module.exports.getPost = async (req, res) => {
	try {
		const user = req.user;

		const posts = await Post.find({ user: user });

		return res.status(200).json({ success: true, posts: posts });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: "Could not get posts",
		});
	}
};

module.exports.postAddPost = async (req, res) => {
	try {
		const { caption } = req.body;
		const image = req.file.path;

		// getting user
		const user = req.user;

		const post = new Post({ caption, image, user });
		await post.save();
		return res.status(200).json(post);
	} catch (error) {
		console.log(error);
		return res.send("yeta error");
	}
};

module.exports.putUpdatePost = async (req, res) => {
	try {
		const id = req.params.id;
		const { caption } = req.body;
		const post = await Post.findById(id);

		// validation if the user is the post owner
		const user = req.user;

		if (user._id.toString() !== post.user.toString())
			return res.status(402).json({ error: "Unauthorized to Update" });

		post.caption = caption;
		await post.save();
		return res.status(200).json(post);
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not update posts" });
	}
};

module.exports.deletePost = async (req, res) => {
	try {
		const id = req.params.id;

		const post = await Post.findById(id);

		// validation if the user is the post owner
		const user = req.user;

		if (user._id.toString() !== post.user.toString())
			return res.status(402).json({ error: "Unauthorized to Delte" });

		await Post.deleteOne({ _id: id });
		return res.status(200).json(post);
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not update posts" });
	}
};

module.exports.getComments = async (req, res) => {
	try {
		const postID = req.params.id;
		const comments = await Comment.find({ post: postID });

		res.status(200).json({ success: true, comments });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not fetch Comments" });
	}
};

module.exports.postComments = async (req, res) => {
	try {
		const postID = req.params.id;
		const user = req.user;
		const { comment } = req.body;

		const newComment = new Comment({
			comment,
			commentedBy: user,
			post: mongoose.Types.ObjectId(postID),
		});
		await newComment.save();
		return res.status(200).json({ success: true, comment: newComment });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not add Comments" });
	}
};

module.exports.putComments = async (req, res) => {
	try {
		const commentID = req.params.id;
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not update Comments" });
	}
};

module.exports.deleteComments = async (req, res) => {
	try {
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not delete Comments" });
	}
};
