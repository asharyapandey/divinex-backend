const User = require("../models/User");
const mongoose = require("mongoose");
const URI = "mongodb://localhost:27017/divinex_test";
beforeAll(async () => {
	await mongoose.connect(URI, {
		useNewUrlParser: true,
		useCreateIndex: false,
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("User Schema testing", () => {
	// registration testing
	it("User Registration testing", async () => {
		const data = {
			username: "asharya",
			password: "asharya",
			email: "info@asharya.com",
			gender: "male",
		};

		const user = await User.create(data);
		expect(user.username).toEqual("asharya");
	});

	it("User update testing", async () => {
		const user = await User.findOne({ username: "asharya" });
		const data = await User.findOneAndUpdate(
			{ _id: user._id },
			{ $set: { username: "ram" } },
			{ new: true }
		);
		expect(data.username).toEqual("ram");
	});

	it("User deletion testing", async () => {
		const status = await User.deleteOne({ username: "ram" });
		expect(status.ok).toBe(1);
	});
});
