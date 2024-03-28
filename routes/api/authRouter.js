import express from "express";
import { ctrl } from "../../controllers/authControllers.js";
import { createUserSchema } from "../../models/users.js";
import { updateUserSubsSchema } from "../../models/users.js";
import validateBody from "../../middlewares/validateBody.js";
import { upload } from "../../middlewares/upload.js";
import { authenticate } from "../../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), ctrl.register);

authRouter.post("/login", validateBody(createUserSchema), ctrl.login);

authRouter.get("/current", authenticate, ctrl.getCurrent);

authRouter.post("/logout", authenticate, ctrl.logout);

authRouter.patch("/", authenticate, validateBody(updateUserSubsSchema), ctrl.updateSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar);

export default authRouter;
