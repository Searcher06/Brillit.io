import { Router } from "express";
import { signUp, signIn, signOut, getMe, updateProfile } from "../controllers/auth.controllers.js";
import protect from "../middlewares/authMiddlware.js";
const router = Router()


router.post('/sign-up', signUp)

router.post('/sign-in', signIn)

router.post('/sign-out', signOut)

// GET /api/v1/users/me
// desc: Display user data
// access: private
router.get('/me', protect, getMe)

// POST /api/v1/users/me/updateProfile
// desc: update user data 
// access: private
router.put('/updateProfile', protect, updateProfile)

export default router