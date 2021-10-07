const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

// constants
const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/divinex";

// database
const connectDB = require("./utils/database");

const MODE = "DEV";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (MODE === "DEV") {
	app.use(morgan("dev"));
}

app.use("/images", express.static(path.join(__dirname, "images")));
// user routes
app.use("/api/user", require("./routes/user"));
// post routes
app.use("/api/post", require("./routes/post"));

app.listen(PORT, (err) => {
	if (err) throw err;

	connectDB(MONGO_URI);
	console.log(`API started at port: ${PORT}`);
});
