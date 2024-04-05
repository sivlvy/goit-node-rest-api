import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import gravatar from "gravatar";
import { fileURLToPath } from "url";
import HttpError from "../helpers/HttpError.js";
import fs from "fs/promises";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import { User } from "../models/users.js";
import sendEmail from "../helpers/sendEmail.js";
const { SECRET_KEY, BASE_URL } = process.env;

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

	const verificationToken = nanoid();

	const verifyEmail = {
		to: email,
		subject: "Verify email",
		html: `<a target='_blank' href='${BASE_URL}/api/users/verify/${verificationToken}' >Click here to verify your account</a>`,
	};
	await sendEmail(verifyEmail);
	const newUser = await User.create({
		email,
		password: hashPassword,
		avatarURL,
		verificationToken,
	});

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
			avatarURL: newUser.avatarURL,
		},
	});
};

const verifyEmail = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await User.findOne({ verificationToken });

	if (!user) {
		throw HttpError(401, "Email not found");
	}

	await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

	res.json({ message: "Email verify success" });
};

const resendVerifyEmail = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email not found");
	}
	if (user.verify) {
		throw HttpError(401, "Email already verify");
	}

	const verifyEmail = {
		to: email,
		subject: "Verify email",
		html: `<a target='_blank' href='${BASE_URL}/api/users/verify/${user.verificationToken}' >Click here to verify your account</a>`,
	};

	await sendEmail(verifyEmail);

	res.json({ message: "Verify email send success" });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		throw HttpError(401, "Email or password is wrong");
	}

	if (!user.verify) {
		throw HttpError(401, "Email not verified");
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

	try {
		const image = await Jimp.read(tempUpload);
		await image.resize(250, 250);
		await image.writeAsync(tempUpload);
	} catch (error) {
		console.error("Помилка обробки зображення:", error);
		throw HttpError(500, "Internal Server Error");
	}

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
	verifyEmail: ctrlWrapper(verifyEmail),
	resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
