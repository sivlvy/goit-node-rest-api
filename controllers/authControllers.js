import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import gravatar from "gravatar";
import { fileURLToPath } from "url";
import HttpError from "../helpers/HttpError.js";
import fs from "fs/promises";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

import { User } from "../models/users.js";

const { SECRET_KEY } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const avatarURL = gravatar.url(email);

	const newUser = await User.create({ email, password: hashPassword, avatarURL });

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
			avatarURL: newUser.avatarURL,
		},
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		throw HttpError(401, "Email or password is wrong");
	}

	const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		token: token,
		user: { email: user.email, subscription: user.subscription },
	});
};

const getCurrent = async (req, res) => {
	const { email, subscription } = req.user;

	res.json({ email, subscription });
};

const logout = async (req, res) => {
	const { _id } = req.user;

	await User.findByIdAndUpdate(_id, { token: "" });

	res.json({ message: "Logout success" });
};

const updateSubscription = async (req, res) => {
	const { subscription } = req.body;
	const { _id } = req.user;

	await User.findByIdAndUpdate(_id, { subscription });

	res.json({ message: "User subscription successful updated" });
};

const updateAvatar = async (req, res) => {
	const { _id } = req.user;
	if (!req.file) {
		throw HttpError(400, "Not found");
	}
	const { path: tempUpload, originalname } = req.file;

	const filename = `${_id}_${originalname}`;
	const resultUpload = path.join(avatarsDir, filename);
	await fs.rename(tempUpload, resultUpload);
	const avatarURL = path.join("avatars", filename);
	await User.findByIdAndUpdate(_id, { avatarURL });

	res.json({
		avatarURL,
	});
};

export const ctrl = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	updateSubscription: ctrlWrapper(updateSubscription),
	updateAvatar: ctrlWrapper(updateAvatar),
};
