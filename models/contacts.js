import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

export const createContactSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.string().required(),
	favorite: Joi.boolean(),
	// favorite: Joi.boolean().required(),
});

export const updateContactSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string(),
	phone: Joi.string(),
});

export const updateFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

const contactSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Set name for contact"],
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "user",
			require: true,
		},
	},
	{ versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

export const Contact = model("contact", contactSchema);
