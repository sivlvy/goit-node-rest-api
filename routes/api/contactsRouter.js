import express from "express";
import { isValidId } from "../../helpers/isValid.js";
import { ctrl } from "../../controllers/contactsControllers.js";
import validateBody from "../../helpers/validateBody.js";
import {
	updateFavoriteSchema,
	createContactSchema,
	updateContactSchema,
} from "../../models/contacts.js";
import { authenticate } from "../../helpers/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, ctrl.getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, ctrl.getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, ctrl.deleteContact);

contactsRouter.post("/", authenticate, validateBody(createContactSchema), ctrl.createContact);

contactsRouter.put(
	"/:id",
	authenticate,
	isValidId,
	validateBody(updateContactSchema),
	ctrl.updateContact
);

contactsRouter.patch(
	"/:id/favorite",
	authenticate,
	isValidId,
	validateBody(updateFavoriteSchema),
	ctrl.updateStatusContact
);

export default contactsRouter;
