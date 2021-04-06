const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyUser = async (req, res, next) => {
	const token = req.header("auth-token");

	if (!token) {
		return res.status(401).json({ error: "error! token not found" });
	}

	try {
		const decoded = jwt.verify(token, "random-secret");
		const user = await User.findById({ _id: decoded.id }, { password: 0 })
			.populate("followers.user")
			.populate("following.user")
			.populate("notification.user");
		// add user to the request
		req.user = user;

		next();
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: "invalid token" });
	}
};

module.exports = {
	verifyUser,
};
