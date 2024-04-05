import express from "express";
import { ctrl } from "../../controllers/authControllers.js";
import { createUserSchema } from "../../models/users.js";
import { updateUserSubsSchema } from "../../models/users.js";
import validateBody from "../../middlewares/validateBody.js";
import { upload } from "../../middlewares/upload.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { emailSchema } from "../../models/users.js";

const authRouter = express.Router();

authRouter.get("/current", authenticate, ctrl.getCurrent);

authRouter.get("/verify/:verificationToken", ctrl.verifyEmail);

authRouter.post("/verify", validateBody(emailSchema), ctrl.resendVerifyEmail);

authRouter.post("/register", validateBody(createUserSchema), ctrl.register);

authRouter.post("/login", validateBody(createUserSchema), ctrl.login);

authRouter.post("/logout", authenticate, ctrl.logout);

authRouter.patch("/", authenticate, validateBody(updateUserSubsSchema), ctrl.updateSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar);

export default authRouter;
