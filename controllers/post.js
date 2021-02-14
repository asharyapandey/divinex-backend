const Post = require("../models/Post");

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
