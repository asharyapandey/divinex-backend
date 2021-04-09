const Comment = require("../models/Comment");
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

describe("Comment Schema testing", () => {
	it("Adding Comment testing", async () => {
		const data = {
			comment: "Nice Photo",
		};

		const comment = await Comment.create(data);

		expect(comment.comment).toEqual("Nice Photo");
	});

	it("Comment update testing", async () => {
		const comment = await Comment.findOne({ comment: "Nice Photo" });
		const data = await Comment.findOneAndUpdate(
			{ _id: comment._id },
			{ $set: { comment: "Noice" } },
			{ new: true }
		);
		expect(data.comment).toEqual("Noice");
	});

	it("Comment deletion testing", async () => {
		const status = await Comment.deleteOne({ comment: "Noice" });
		expect(status.ok).toBe(1);
	});
});
