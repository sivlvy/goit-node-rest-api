import express from "express";
import { ctrl } from "../../controllers/authControllers.js";
import { createUserSchema } from "../../models/users.js";
import { updateUserSubsSchema } from "../../models/users.js";
import validateBody from "../../helpers/validateBody.js";
import { authenticate } from "../../helpers/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), ctrl.register);

authRouter.post("/login", validateBody(createUserSchema), ctrl.login);

authRouter.get("/current", authenticate, ctrl.getCurrent);

authRouter.post("/logout", authenticate, ctrl.logout);

authRouter.patch("/", authenticate, validateBody(updateUserSubsSchema), ctrl.updateSubscription);

export default authRouter;
