const express = require("express");

const Router = express.Router();

const { check } = require("express-validator");

const { profileUpload } = require("../middlewares/photoUpload");

// controllers
const {
	postRegisterUser,
	postLoginUser,
	getUser,
	putUpdateUser,
} = require("../controllers/user");

// route will be used for registration
Router.post(
	"/",
	[
		check("username", "Please provide a username").not().isEmpty(),
		check("email", "Please provide a valid email").isEmail(),
		check("password", "Please provide a Password").not().isEmpty(),
	],
	postRegisterUser
);

// route will be used for login
Router.post("/login", postLoginUser);

Router.get("/:id", getUser);

Router.put("/:id", profileUpload.single("image"), putUpdateUser);

module.exports = Router;
