const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
	caption: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

module.exports = mongoose.model("Post", postSchema);
