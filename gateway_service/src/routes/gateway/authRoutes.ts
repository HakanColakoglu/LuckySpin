import { Router } from "express";
import { signUp, signIn, logout } from "../../controllers/gateway/authController";
import { validateUserInput } from "../../middlewares/inputValidate";
import checkIfSignedIn from "../../middlewares/checkIfSignedIn";
const router = Router();

router.post("/signup", validateUserInput, checkIfSignedIn, signUp);
router.post("/signin", checkIfSignedIn, signIn);
router.get("/logout", logout);

export default router;
