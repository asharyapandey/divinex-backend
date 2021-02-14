const multer = require("multer");

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images/posts");
	},
	filename: (req, res, cb) => {
		const fileName = `POST-${new Date().toDateString()}-${
			file.originalname
		}`;
		cb(null, fileName);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const postUpload = multer({ storage: fileStorage, fileFilter });

module.exports = {
	postUpload,
};
