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
	fullName: String,
	profilePicture: String,
	password: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("User", userSchema);
