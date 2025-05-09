import { Router } from "express";
import { signUp, signIn, signOut, getMe } from "../controllers/auth.controllers.js";
import protect from "../middlewares/authMiddlware.js";
const router = Router()


router.post('/sign-up', signUp)

router.post('/sign-in', signIn)

router.post('/sign-out', signOut)

router.get('/me', protect, getMe)



export default router