const Post = require("../models/postModel");
const User = require("../models/userModel");

const HttpError = require("../models/errorModel");

// ============================== CREATE A POST ==============================
// POST : api/posts
//PROTECTED
module.exports.createPost = async (req, res, next) => {
	try {
		let { title, category, description } = req.body;
		if (!title || !category || !description) {
			return next(new HttpError("All fields must be filled in.", 422));
		}

		let url = req.file.path;
		let filename = req.file.filename;

		//Check the file size
		if (req.file.size > 20000000) {
			return next(
				new HttpError("Thumbnail is too large.File should be less than 2mb.")
			);
		}

		const newPost = await Post.create({
			title,
			category,
			description,
			thumbnail: { url, filename },
			creator: req.user.id,
		});
		if (!newPost) {
			return next(new HttpError("Post couldn't be created.", 422));
		}

		//Find user and increase post count by 1
		const currentUser = await User.findById(req.user.id);
		const userPostCount = currentUser.posts + 1;
		await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

		res.status(201).json(newPost);
	} catch (error) {
		return next(new HttpError(error));
	}
};

// ============================== Get All POST ==============================
// GET : api/posts
//UNPROTECTED
module.exports.getPosts = async (req, res, next) => {
	try {
		let posts = await Post.find().sort({ updatedAt: -1 });
		res.status(200).json(posts);
	} catch (error) {
		return next(new HttpError(error));
	}
};

// ============================== Get SINGLE POST ==============================
// GET : api/posts/:id
//UNPROTECTED
module.exports.getPost = async (req, res, next) => {
	try {
		let postId = req.params.id;
		// console.log(postId);
		let post = await Post.findById(postId);
		if (!post) {
			return next(new HttpError("Post not found.", 404));
		}
		// console.log(post.thumbnail);
		res.status(200).json(post);
	} catch (error) {
		return next(new HttpError(error));
	}
};

// ============================== GET POSTS BT CATEGORY ==============================
// GET : api/posts/categories/:category
//UNPROTECTED
module.exports.getCatPosts = async (req, res, next) => {
	try {
		let { category } = req.params;
		const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
		res.status(200).json(catPosts);
	} catch (error) {
		return next(new HttpError(error));
	}
};

// ============================== GET AUTHOR POST
// GET : api/posts/users/:id
//UNPROTECTED
module.exports.getUserPosts = async (req, res, next) => {
	try {
		let id = req.params.id;
		let userPosts = await Post.find({ creator: id }).sort({ createdAt: -1 });
		res.status(200).json(userPosts);
	} catch (error) {
		return next(new HttpError(error));
	}
};

// ============================== EDIT POST
// PATCH : api/posts/:id
//PROTECTED
module.exports.editPost = async (req, res, next) => {
	try {
		const postId = req.params.id;
		let { title, category, description } = req.body;
		console.log("Request Body:", req.body);

		if (!title || !category || !description) {
			return next(new HttpError("All fields are required", 422));
		}

		if (!req.file) {
			updatedPost = await Post.findByIdAndUpdate(
				postId,
				{ title, category, description },
				{ new: true }
			);
		} else {
			// Get old post from database
			const oldPost = await Post.findById(postId);

			let url = req.file.path;
			let filename = req.file.filename;

			if (req.file.size > 20000000) {
				return next(
					new HttpError("Thumbnail too big. Should be less than 2mb")
				);
			}

			updatedPost = await Post.findByIdAndUpdate(
				postId,
				{
					title,
					category,
					description,
					thumbnail: { url, filename },
				},
				{ new: true }
			);
		}
		res.status(200).json(updatedPost);
	} catch (error) {
		return next(new HttpError(error));
	}
};

// ============================== DELETE POST
// DELETE : api/posts/:id
//PROTECTED
module.exports.deletePost = async (req, res, next) => {
	try {
		let postId = req.params.id;
		if (!postId) {
			return next(new HttpError("Post not found.", 400));
		}
		const post = await Post.findById(postId);

		if (req.user.id == post.creator) {
			await Post.findByIdAndDelete(postId);

			//Find user and reduce post count by 1
			const currentUser = await User.findById(req.user.id);
			const userPostCount = currentUser?.posts - 1;
			await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
			res.json(`Post ${postId} deleted successfully.`);
		} else {
			return next(new HttpError("Post couldn't be deleted.", 403));
		}
	} catch (error) {
		return next(new HttpError(error));
	}
};
