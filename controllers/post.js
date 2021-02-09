const Post = require("../models/Post");

module.exports.postAddPost = async (req, res) => {
	try {
		const { caption, image } = req.body;
		const post = new Post({ caption, image });
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
