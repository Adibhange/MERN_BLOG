const { Router } = require("express");

//For Uploading Files using Cloud Storage
const multer = require("multer");
const { storage } = require("../cloudinaryConfig.js");
const upload = multer({ storage });

const {
	registerUser,
	loginUser,
	getUser,
	changeAvatar,
	editUser,
	getAuthors,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.post(
	"/change-avatar",
	authMiddleware,
	upload.single("avatar"),
	changeAvatar
);
router.patch("/edit-user", authMiddleware, editUser);
router.get("/", getAuthors);

module.exports = router;
