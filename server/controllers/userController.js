const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const HttpError = require("../models/errorModel");

// ============================== REGISTER A NEW USER ==============================
// POST : api/users/register
//UNPROTECTED
module.exports.registerUser = async (req, res, next) => {
	const { name, email, password, password2 } = req.body;

	const newName = name;
	const nameExists = await User.findOne({ name: newName });
	if (nameExists) {
		return next(new HttpError("Already user exists with simillar name.", 422));
	}

	const newEmail = email.toLowerCase();
	const emailExists = await User.findOne({ email: newEmail });
	if (emailExists) {
		return next(new HttpError("Email already exists.", 422));
	}
	if (password.trim().length < 6) {
		return next(new HttpError("Password must be at least 6 characters.", 422));
	}
	if (password != password2) {
		return next(new HttpError("Passwords do not match.", 422));
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPass = await bcrypt.hash(password, salt);

	const newUser = await User.create({
		name,
		email: newEmail,
		password: hashedPass,
	});

	res.status(201).json({
		message: `New user ${newUser.email} registered.`,
		user: {
			id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			password: hashedPass,
		},
	});
};

// ============================== LOGIN A REGISTERED USER ==============================
// POST : api/users/login
//UNPROTECTED
module.exports.loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return next(new HttpError("All fields required.", 422));
		}

		const user = await User.findOne({ email });
		if (!user) {
			return next(
				new HttpError("Email not registerd. Please first Sign up.", 422)
			);
		}
		const comparePass = await bcrypt.compare(password, user.password);
		if (!comparePass) {
			return next(new HttpError("Password doesn't match", 422));
		}
		const { _id: id, name } = user;
		const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});

		res.status(200).json({ token, id, name });
	} catch (error) {
		return next(
			new HttpError("Login failed. Please check your credentials.", 422)
		);
	}
};

// ============================== USER PROFILE ==============================
// get : api/users/:id
//PROTECTED
module.exports.getUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id).select("-password");

		if (!user) {
			return next(new HttpError("User not found", 422));
		}
		res.status(200).json(user);
	} catch (error) {
		return next(new HttpError(error));
	}
};

// ============================== CHANGE USER AVATAR (profile picture) ==============================
// POST : api/users/change-avatar
//PROTECTED
module.exports.changeAvatar = async (req, res, next) => {
	try {
		if (!req.file) {
			return next(new HttpError("Please choose an image.", 422));
		}

		const url = req.file.path;
		const filename = req.file.filename;

		//Find user from database
		const user = await User.findById(req.user.id);

		//Check file/image size
		if (req.file.size > 5000000) {
			return next(
				new HttpError("Profile picture too big. Should be less than 500kb"),
				422
			);
		}

		const updatedAvatar = await User.findByIdAndUpdate(
			req.user.id,
			{
				avatar: { url, filename },
			},
			{ new: true }
		);

		if (!updatedAvatar) {
			return next(new HttpError("Avatar couldn't changed", 422));
		}

		res.status(200).json(updatedAvatar);
	} catch (error) {
		return next(new HttpError(error));
	}
};

// ============================== EDIT USER DETAILS (from profile) ==============================
// POST : api/users/edit-user
//PROTECTED
module.exports.editUser = async (req, res, next) => {
	try {
		let { name, email, currentPassword, newPassword, confirmNewPassword } =
			req.body;

		if (!name || !email || !currentPassword || !newPassword) {
			return next(new HttpError("All fields are required", 422));
		}

		//Get user from Database
		const user = await User.findById(req.user.id);
		if (!user) {
			return next(new HttpError("User not found. ", 403));
		}

		//Make sure new email does not already exist
		const newEmail = email.toLowerCase();
		const emailExists = await User.findOne({ email: newEmail });

		if (emailExists && emailExists._id == req.user.id) {
			return next(new HttpError("Email already exists.", 422));
		}

		//compare current password to database password
		const validateUserPassword = await bcrypt.compare(
			currentPassword,
			user.password
		);
		if (!validateUserPassword) {
			return next(new HttpError("Invalid current password.", 422));
		}

		// compare new password
		if (newPassword !== confirmNewPassword) {
			return next(new HttpError("New passwords do not match.", 422));
		}

		//hash new passord
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newPassword, salt);

		//update the user's info in the database
		const newInfo = await User.findByIdAndUpdate(
			req.user.id,
			{ name, email, password: hash },
			{ new: true }
		);
		res.status(200).json(newInfo);
	} catch (error) {
		return next(new HttpError(error));
	}
};

// ============================== GET AUTHORS ==============================
// GET : api/users/authors
//PROTECTED
module.exports.getAuthors = async (req, res, next) => {
	try {
		const authors = await User.find().select("-password");
		res.json(authors);
	} catch (error) {
		return next(new HttpError(error));
	}
};
