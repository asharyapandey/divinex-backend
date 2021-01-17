const express = require("express");

const Router = express.Router();

// User MOdel
const User = require("../models/User");

Router.post("/", async (req, res) => {
	const { username, email, password } = req.body;

	const user = User({
		username,
		email,
		password,
	});
	try {
		await user.save();
		return res.json(user);
	} catch (error) {
		return res.status(400).json({ error: "invalid details" });
	}
});

Router.get("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.findOne({ _id: id });

		res.json(user);
	} catch (error) {
		return res.status(400).json({ error: "No User Found" });
	}
});

module.exports = Router;
