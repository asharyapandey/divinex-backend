const User = require("../models/User");
const { validationResult } = require("express-validator");

const { hashPassword, verifyPassword, createToken } = require("../utils/utils");

module.exports.postRegisterUser = async (req, res) => {
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		const { username, email, password } = req.body;

		try {
			const hashedPassword = await hashPassword(password);
			const user = User({
				username,
				email,
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
