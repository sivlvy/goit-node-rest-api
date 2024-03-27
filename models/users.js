import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

import Joi from "joi";

const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const subscriptionList = ["starter", "pro", "business"];

export const createUserSchema = Joi.object({
	email: Joi.string().required().pattern(emailRegexp),
	password: Joi.string().min(6).required(),
});

export const updateUserSubsSchema = Joi.object({
	subscription: Joi.string()
		.required()
		.valid(...subscriptionList),
});

export const userSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		token: {
			type: String,
			default: null,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "user",
			require: true,
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

export const User = model("user", userSchema);
