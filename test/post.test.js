const Post = require("../models/Post");
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

describe("Post Schema testing", () => {
	it("Adding Post testing", async () => {
		const user = await User.findOne();
		const data = {
			caption: "Vacation",
			image: "images/randomImage.jpg",
			user: user._id,
		};

		const post = await Post.create(data);

		expect(post.caption).toEqual("Vacation");
	});

	it("Post update testing", async () => {
		const post = await Post.findOne({ caption: "Vacation" });
		const data = await Post.findOneAndUpdate(
			{ _id: post._id },
			{ $set: { caption: "Vacation2" } },
			{ new: true }
		);
		expect(data.caption).toEqual("Vacation2");
	});

	it("Comment deletion testing", async () => {
		const status = await Post.deleteOne({ comment: "Vacation2" });
		expect(status.ok).toBe(1);
	});
});
