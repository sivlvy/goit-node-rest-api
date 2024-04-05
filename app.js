import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/api/contactsRouter.js";
import "dotenv/config";
import authRouter from "./routes/api/authRouter.js";

const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

app.use((_, res) => {
	res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Server error" } = err;
	res.status(status).json({ message });
});

const { DB_HOST, PORT = 3000 } = process.env;
mongoose
	.connect(DB_HOST)
	.then(() => app.listen(3000), console.log("Database connection successful"))
	.catch((err) => {
		console.log(err.message);
		process.exit(1);
	});
