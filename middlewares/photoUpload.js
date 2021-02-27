const multer = require("multer");

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images/posts");
	},
	filename: (req, file, cb) => {
		const fileName = `POST-${new Date().toDateString()}-${
			file.originalname
		}`;
		cb(null, fileName);
	},
});

const fileStorageProfile = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images/profile_picture");
	},
	filename: (req, file, cb) => {
		const fileName = `PROFILE-${new Date().toDateString()}-${
			file.originalname
		}`;
		cb(null, fileName);
	},
});

const fileFilter = (req, file, cb) => {
	console.log(file.mimetype);
	if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const postUpload = multer({ storage: fileStorage, fileFilter: fileFilter });
const profileUpload = multer({ storage: fileStorageProfile, fileFilter });

module.exports = {
	postUpload,
	profileUpload,
};
