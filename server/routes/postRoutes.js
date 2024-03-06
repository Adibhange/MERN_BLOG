const { Router } = require("express");
const router = Router();

//For Uploading Files using Cloud Storage
const multer = require("multer");
const { storage } = require("../cloudinaryConfig.js");
const upload = multer({ storage });

const {
	createPost,
	getPosts,
	getPost,
	getCatPosts,
	getUserPosts,
	editPost,
	deletePost,
} = require("../controllers/postController.js");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, upload.single("thumbnail"), createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/categories/:category", getCatPosts);
router.get("/users/:id", getUserPosts);
router.patch("/:id", authMiddleware, upload.single("thumbnail"), editPost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
