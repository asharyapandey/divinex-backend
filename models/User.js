const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	fullName: String,
	profilePicture: String,
	password: {
		type: String,
		required: true,
	},
	followers: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		},
	],
	following: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		},
	],
});

module.exports = mongoose.model("User", userSchema);
