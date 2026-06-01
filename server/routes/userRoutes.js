import { Router } from "express";
import { signUp, signIn, signOut, getMe, updateProfile, getHistory, clearHistory } from "../controllers/auth.controllers.js";
import { getWatchLater, addToWatchLater, removeFromWatchLater, clearWatchLater } from "../controllers/watchLater.js";
import protect from "../middlewares/authMiddlware.js";
import upload from "../middlewares/upload.js";
const router = Router()

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)
router.post('/sign-out', signOut)

router.get('/me', protect, getMe)
router.get('/history', protect, getHistory)
router.delete('/history', protect, clearHistory)

router.get('/watch-later', protect, getWatchLater)
router.post('/watch-later/:videoId', protect, addToWatchLater)
router.delete('/watch-later/:videoId', protect, removeFromWatchLater)
router.delete('/watch-later', protect, clearWatchLater)

router.put('/updateProfile', protect, upload.single('image'), updateProfile)

export default router