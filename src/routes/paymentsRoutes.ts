// routes/paymentRoutes.js
import { Router } from "express";
import PagarmeController from "../Controllers/Pagarme";
import { chekingTokenUser } from "../Middleware";

const router = Router();

// Payment routes
router.post("/create-order", chekingTokenUser, PagarmeController.createOrder);
router.post("/webhook", PagarmeController.webHook);

export default router;
