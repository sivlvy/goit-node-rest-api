import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

import { User } from "../models/users.js";

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({ email, password: hashPassword });

	res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
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

	await User.findByIdAndUpdate(_id, { token: null });

	res.status(204).json({ message: "Logout success" });
};

const updateSubscription = async (req, res) => {
	const { subscription } = req.body;
	const { _id } = req.user;

	await User.findByIdAndUpdate(_id, { subscription });

	res.json({ message: "User subscription successful updated" });
};

export const ctrl = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	updateSubscription: ctrlWrapper(updateSubscription),
};
