import { Router } from "express";
import { signUp, signIn, signOut, getMe } from "../controllers/auth.controllers.js";
const router = Router()


router.post('/sign-up', signUp)

router.post('/sign-in', signIn)

router.post('/sign-out', signOut)

router.get('/me', getMe)



export default router