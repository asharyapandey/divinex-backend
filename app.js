const express = require("express");
const mongoose = require("mongoose");

// constants
const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/divinex";

// database
const connectDB = require("./utils/database");

const app = express();

app.use(express.json());

// user routes
app.use("/api/user", require("./routes/user"));
// post routes
app.use("/api/post", require("./routes/post"));

app.listen(PORT, (err) => {
	if (err) throw err;

	connectDB(MONGO_URI);
	console.log(`API started at port: ${PORT}`);
});
