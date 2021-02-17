const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	comment: String,
	commentedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
	},
	date: Date.now(),
});

module.exports = mongoose.model("Comment", commentSchema);
