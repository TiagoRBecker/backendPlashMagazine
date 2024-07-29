// routes/userRoutes.js
import { Router } from "express";
import { chekingTokenUser } from "../Middleware";
import UserController from "../Controllers/User";
import CoversController from "../Controllers/CoversOfMonth";

const router = Router();

// User protected routes
router.get("/user", chekingTokenUser, UserController.getOneUser);
router.post(
  "/user/update-profile",
  chekingTokenUser,
  UserController.updatePerfilUser
);
router.post(
  "/user/change-password",
  chekingTokenUser,
  UserController.changePassUser
);
router.delete("/user/delete", chekingTokenUser, UserController.deletUser);
router.post(
  "/vote-cover-event/:slug",
  chekingTokenUser,
  CoversController.addVoteCover
);

export default router;
