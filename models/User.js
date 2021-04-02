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
	profilePicture: {
		type: String,
		default: "images/profile_picture/avatar.png",
	},
	password: {
		type: String,
		required: true,
		select: false,
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

// converts follow stats to {userDetails} from {_id: ..., user: {userDetaila}}
userSchema.methods.convertFollowStats = function () {
	const newFollowers = this.followers.filter((follower) => follower.user);
	const newFollowing = this.following.map((follower) => follower.user);
	const newUser = {
		...this._doc,
		following: newFollowing,
		followers: newFollowers,
	};
	return newUser;
};

module.exports = mongoose.model("User", userSchema);
