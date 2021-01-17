const mongoose = require("mongoose");

module.exports.connectDB = async (MONGO_URI) => {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB is connected");
	} catch (err) {
		console.log(err);
	}
};
