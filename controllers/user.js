const User = require("../models/User");
const { validationResult } = require("express-validator");

const { hashPassword, verifyPassword, createToken } = require("../utils/utils");

module.exports.postRegisterUser = async (req, res) => {
	console.log(req.body);
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		const { username, email, password, gender } = req.body;

		try {
			let user = await User.findOne({ username });
			if (user)
				return res
					.status(409)
					.json({ success: false, error: "Username already exists" });

			const hashedPassword = await hashPassword(password);
			// TODO: add dummy profile picture
			user = User({
				username,
				email,
				gender,
				password: hashedPassword,
			});
			await user.save();
			return res.status(200).json({ success: true, user });
		} catch (error) {
			console.log(error);
			return res
				.status(400)
				.json({ success: false, error: "Could not register user" });
		}
	} else {
		console.log(errors.array());
		res.status(400).json({ success: false, error: errors.array() });
	}
};

module.exports.postLoginUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username })
			.select("+password")
			.populate("followers.user")
			.populate("following.user");

		if (user === null)
			return res
				.status(400)
				.json({ success: false, error: "User Not Found" });
		const passwordVerification = await verifyPassword(
			password,
			user.password
		);
		if (passwordVerification) {
			const jwt = createToken(user);
			const newUser = user.convertFollowStats();
			return res.status(200).json({
				success: true,
				token: jwt,
				user: newUser,
			});
		} else {
			return res.status(400).json({
				success: false,
				error: "Either Username or Password is incorrects",
			});
		}
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not login user" });
	}
};

module.exports.getUser = async (req, res) => {
	try {
		const user = req.user;
		if (user === null) {
			return res
				.status(201)
				.json({ success: false, error: "User not Found" });
		}

		return res.json({ success: true, user });
	} catch (error) {
		return res.status(400).json({ success: false, error: "No User Found" });
	}
};

module.exports.getUserById = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id)
			.populate("followers.user")
			.populate("following.user");
		if (user === null) {
			return res
				.status(201)
				.json({ success: false, error: "User not Found" });
		}
		const newUser = user.convertFollowStats();

		return res.json({ success: true, user: newUser });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: "No User Found" });
	}
};
module.exports.putUpdateUser = async (req, res) => {
	try {
		const id = req.params.id;
		const { email, gender } = req.body;

		const user = await User.findOne({ _id: id });
		if (user === null) {
			return res.status(201).json({ error: "User not Found" });
		}

		if (req.file !== null) {
			user.profilePicture = req.file.path;
			user.email = email;
			user.gender = gender;
			await user.save();
		} else {
			user.email = email;
			user.gender = gender;
			await user.save();
		}

		return res.status(200).json(user);
	} catch (error) {
		return res.status(400).json({ error: "No User Found" });
	}
};

module.exports.postFollowUser = async (req, res) => {
	try {
		const user = req.user;
		const toFollow = await User.findById({ _id: req.params.id });

		// getting the current logged in users following array
		let following = user.following;

		// getting the followrs array of toFollow user
		let followers = toFollow.followers;

		if (following === null) {
			following = [{ user: toFollow }];
		} else {
			following.push({ user: toFollow });
		}

		if (followers === null) {
			followers = [{ user }];
		} else {
			followers.push({ user });
		}
		user.following = following;
		toFollow.followers = followers;
		await user.save();
		await toFollow.save();

		// sending the new user
		const populatedUser = await User.findById(user._id)
			.populate("followers.user")
			.populate("following.user");
		const newUser = populatedUser.convertFollowStats();

		res.status(200).json({ success: true, user: newUser });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not follow user" });
	}
};

module.exports.deleteFollowUser = async (req, res) => {
	try {
		const user = req.user;
		const toUnfollow = await User.findById({ _id: req.params.id });

		// getting the current logged in users following array
		let following = user.following;

		// getting the followrs array of toFollow user
		let followers = toUnfollow.followers;

		following = following.filter(
			(eachFollow) =>
				eachFollow.user.toString() !== toUnfollow._id.toString()
		);
		followers = followers.filter(
			(eachFollower) =>
				eachFollower.user.toString() !== user._id.toString()
		);

		user.following = following;
		toUnfollow.followers = followers;
		await user.save();
		await toUnfollow.save();

		// sending the new user
		const populatedUser = await User.findById(user._id)
			.populate("followers.user")
			.populate("following.user");
		const newUser = populatedUser.convertFollowStats();

		res.status(200).json({ success: true, user: newUser });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not follow user" });
	}
};

module.exports.getSearchUser = async (req, res) => {
	try {
		// example url => localhost:5000/search?term=ashraya
		const searchTerm = req.query.term;
		const users = await User.find({
			username: RegExp(searchTerm, "i"),
		});
		res.status(200).json({ success: true, users });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, error: "Could not Search User" });
	}
};
