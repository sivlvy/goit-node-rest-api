import express from "express";
import { isValidId } from "../../helpers/isValid.js";
import { ctrl } from "../../controllers/contactsControllers.js";
import validateBody from "../../helpers/validateBody.js";
import {
	updateFavoriteSchema,
	createContactSchema,
	updateContactSchema,
} from "../../models/contacts.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ctrl.getAllContacts);

contactsRouter.get("/:id", isValidId, ctrl.getOneContact);

contactsRouter.delete("/:id", isValidId, ctrl.deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), ctrl.createContact);

contactsRouter.put("/:id", isValidId, validateBody(updateContactSchema), ctrl.updateContact);

contactsRouter.patch(
	"/:id/favorite",
	isValidId,
	validateBody(updateFavoriteSchema),
	ctrl.updateStatusContact
);

export default contactsRouter;
