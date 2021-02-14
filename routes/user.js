const express = require("express");

const Router = express.Router();

// User MOdel
const User = require("../models/User");
const { check, validationResult } = require("express-validator");

const { hashPassword, verifyPassword, createToken } = require("../utils/utils");

// route will be used for registration
Router.post(
	"/",
	[
		check("username", "Please provide a username").not().isEmpty(),
		check("email", "Please provide a valid email").isEmail(),
		check("password", "Please provide a Password").not().isEmpty(),
	],
	async (req, res) => {
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
				return res
					.status(400)
					.json({ error: "Could not register user" });
			}
		} else {
			res.send(errors.array());
		}
	}
);

// route will be used for login
Router.post("/login", async (req, res) => {
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
	} catch (error) {}
});

Router.get("/:id", async (req, res) => {
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
});

module.exports = Router;
