import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contacts.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllContacts = async (req, res, next) => {
	const { _id: owner } = req.user;

	const { page = 1, limit = 10 } = req.query;
	const skip = (page - 1) * limit;
	const result = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate(
		"owner",
		"name email"
	);
	res.json(result);
};

const getOneContact = async (req, res, next) => {
	const { id } = req.params;
	const result = await Contact.findById(id);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const deleteContact = async (req, res, next) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndDelete(id);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const createContact = async (req, res, next) => {
	const { _id: owner } = req.user;

	const result = await Contact.create({ ...req.body, owner });
	if (!result) {
		throw HttpError(404);
	}
	res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
	const { id } = req.params;
	const emptyBody = Object.keys(req.body).length === 0;

	if (emptyBody) throw HttpError(400, "Body must have at least one field");

	const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

	if (!result) throw HttpError(404);

	res.json(result);
};

const updateStatusContact = async (req, res, next) => {
	const { id } = req.params;

	const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

	if (!result) throw HttpError(404);

	res.json(result);
};
export const ctrl = {
	getAllContacts: ctrlWrapper(getAllContacts),
	getOneContact: ctrlWrapper(getOneContact),
	deleteContact: ctrlWrapper(deleteContact),
	createContact: ctrlWrapper(createContact),
	updateContact: ctrlWrapper(updateContact),
	updateStatusContact: ctrlWrapper(updateStatusContact),
};
