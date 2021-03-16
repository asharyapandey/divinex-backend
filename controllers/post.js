const Post = require("../models/Post");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

module.exports.getPost = async (req, res) => {
	try {
		const user = req.user;

		const posts = await Post.find({ user: user }).populate("user");

		return res.status(200).json({ success: true, posts: posts });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: "Could not get posts",
		});
	}
};

module.exports.getPostById = async (req, res) => {
	try {
		const user = req.params.id;

		const posts = await Post.find({ user: user }).populate("user");

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
		if (req.file === undefined)
			return res
				.status(400)
				.json({ success: false, error: "Invalid File" });
		const image = req.file.path;

		// getting user
		const user = req.user;

		const post = new Post({ caption, image, user });
		await post.save();
		return res.status(200).json({ success: true, post });
	} catch (error) {
		console.log(error);
		return res.send("yeta error");
	}
};

module.exports.putUpdatePost = async (req, res) => {
	try {
		const id = req.params.id;
		const { caption } = req.body;
		const image = req.file.path;
		const post = await Post.findById(id);

		// validation if the user is the post owner
		const user = req.user;

		if (user._id.toString() !== post.user.toString())
			return res
				.status(402)
				.json({ success: false, error: "Unauthorized to Update" });

		post.caption = caption;
		post.image = image;
		await post.save();
		return res.status(200).json({ success: true, post });
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
			return res
				.status(402)
				.json({ success: false, error: "Unauthorized to Delte" });

		await Post.deleteOne({ _id: id });
		return res.status(200).json({ success: true, post });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not update posts" });
	}
};

module.exports.getFeed = async (req, res) => {
	try {
		const currentUser = req.user;

		const following = currentUser.following;
		const posts = [];
		for (user of following) {
			const post = await Post.find({ user: user.user }).populate("user");
			// for (p of post) {
			// 	const comments = await Comment.find({ post: p._id });
			// 	var o = { ...p._doc, comments };
			// 	posts.push(o);
			// }
			posts.push(...post);
		}
		return res.status(200).json({ success: true, posts });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not load feed" });
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
		const commentID = req.params.commentId;
		const { comment } = req.body;

		const oldComment = await Comment.findById(commentID);
		oldComment.comment = comment;
		await oldComment.save();

		return res.status(200).json({ success: true, comment: oldComment });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not update Comments" });
	}
};

module.exports.deleteComments = async (req, res) => {
	try {
		const commentID = req.params.commentId;

		await Comment.deleteOne({ _id: commentID });

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not delete Comments" });
	}
};

module.exports.postLike = async (req, res) => {
	try {
		const postID = req.params.postId;
		const user = req.user;

		const post = await Post.findById({ _id: postID });
		// getting previous likers
		let prevLikers = post.like;
		if (prevLikers == null) {
			likers = [{ user }];
			post.like = likers;
		} else {
			prevLikers.push({ user });
			post.like = prevLikers;
		}
		await post.save();

		return res.status(200).json({ success: true, likes: post.like.length });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not add Comments" });
	}
};

module.exports.deleteLike = async (req, res) => {
	try {
		const postID = req.params.postId;
		const user = req.user;

		const post = await Post.findById({ _id: postID });
		// getting previous likers
		let prevLikers = post.like;
		let newLikers = prevLikers.filter(
			(liker) => liker.user.toString() != user._id.toString()
		);
		post.like = newLikers;
		await post.save();

		return res.status(200).json({ success: true, likes: post.like.length });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not add Comments" });
	}
};
