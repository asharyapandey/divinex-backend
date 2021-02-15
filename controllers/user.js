const User = require("../models/User");
const { validationResult } = require("express-validator");

const { hashPassword, verifyPassword, createToken } = require("../utils/utils");

module.exports.postRegisterUser = async (req, res) => {
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		const { username, email, password, gender } = req.body;

		try {
			const hashedPassword = await hashPassword(password);
			// TODO: add dummy profile picture
			const user = User({
				username,
				email,
				gender,
				password: hashedPassword,
			});
			await user.save();
			return res.json(user);
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: "Could not register user" });
		}
	} else {
		res.send(errors.array());
	}
};

module.exports.postLoginUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (user === null)
			return res.status(400).json({ error: "User Not Found" });
		const passwordVerification = await verifyPassword(
			password,
			user.password
		);
		if (passwordVerification) {
			const jwt = createToken(user);
			return res.status(200).json({
				msg: "User Logged In",
				token: jwt,
			});
		} else {
			return res
				.status(400)
				.json({ error: "Either Username or Password is incorrects" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Could not login user" });
	}
};

module.exports.getUser = async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.findOne({ _id: id });
		if (user === null) {
			return res.status(201).json({ error: "User not Found" });
		}

		return res.json(user);
	} catch (error) {
		return res.status(400).json({ error: "No User Found" });
	}
};

module.exports.putUpdateUser = async (req, res) => {
	try {
		const id = req.params.id;
		const { username, email, gender } = req.body;

		const user = await User.findOne({ _id: id });
		if (user === null) {
			return res.status(201).json({ error: "User not Found" });
		}

		if (req.file !== null) {
			user.profilePicture = req.file.path;
			user.username = username;
			user.email = email;
			user.gender = gender;
			await user.save();
		} else {
			user.username = username;
			user.email = email;
			user.gender = gender;
			await user.save();
		}

		return res.status(200).json(user);
	} catch (error) {
		return res.status(400).json({ error: "No User Found" });
	}
};
