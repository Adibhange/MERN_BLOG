if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes.js");
const postRoutes = require("./routes/postRoutes.js");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

main()
	.then(() => {
		console.log("Connected Successfully");
	})
	.catch((err) => {
		console.log(err);
	});

async function main() {
	await mongoose.connect(process.env.MONGO_URL);
}

const corsOrigin =
	process.env.NODE_ENV === "production"
		? process.env.CORS_ORIGIN_DEPLOYMENT
		: process.env.CORS_ORIGIN_LOCAL;

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: corsOrigin }));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
	console.log(`Server listening on ${process.env.PORT}`);
});
