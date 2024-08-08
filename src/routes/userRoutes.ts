// routes/userRoutes.js
import { Router } from "express";
import { chekingTokenUser } from "../Middleware";
import {UserController} from "../Controllers/User";
import CoversController from "../Controllers/CoversOfMonth";

const router = Router();

// User protected routes
router.get("/user/perfil", chekingTokenUser, UserController.getOneUser);
router.get("/user/dvls", chekingTokenUser, UserController.getDvls);
router.get("/user/orders", chekingTokenUser, UserController.getOrders);
router.get("/user/orders/:slug", chekingTokenUser, UserController.getOrderID);
router.get("/user/library", chekingTokenUser, UserController.getLibraryUser);
router.get("/user/library/:slug", chekingTokenUser, UserController.getOneBookLibraryUser);
router.post(
  "/user/update/perfil",
  chekingTokenUser,
  UserController.updatePerfilUser
);
router.post(
  "/user/password",
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
