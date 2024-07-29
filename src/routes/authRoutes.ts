import { Router } from "express";
import AuthControllers from "../Controllers/Auth";
// Rotas públicas
const router = Router();
router.post("/signup/admin", AuthControllers.createAccountUserMaster);
router.post("/signin/admin", AuthControllers.authenticationAdmin);
router.post("/signin/employee", AuthControllers.authenticationEmployee);
router.post("/signup", AuthControllers.createAccount);
router.post("/signIn", AuthControllers.authentication);
export default router;
