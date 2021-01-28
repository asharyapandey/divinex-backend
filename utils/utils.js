const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = (password) => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(12, (err, salt) => {
			if (err) reject(err);

			bcrypt.hash(password, salt, (err, hash) => {
				if (err) reject(err);
				resolve(hash);
			});
		});
	});
};

const verifyPassword = (passwordAttempt, hashedPassword) => {
	return bcrypt.compare(passwordAttempt, hashedPassword);
};

const createToken = (user) => {
	return jwt.sign(
		{
			id: user._id,
			username: user.username,
		},
		"random-secret"
	);
};

module.exports = {
	hashPassword,
	verifyPassword,
	createToken,
};
