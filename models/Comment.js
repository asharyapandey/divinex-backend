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
	commentedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Comment", commentSchema);
