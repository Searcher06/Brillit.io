import { Router } from "express";
import { signUp, signIn, signOut, getMe, updateProfile, getHistory, clearHistory } from "../controllers/auth.controllers.js";
import protect from "../middlewares/authMiddlware.js";
import upload from "../middlewares/upload.js";
const router = Router()

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)
router.post('/sign-out', signOut)

router.get('/me', protect, getMe)
router.get('/history', protect, getHistory)
router.delete('/history', protect, clearHistory)

router.put('/updateProfile', protect, upload.single('image'), updateProfile)

export default router