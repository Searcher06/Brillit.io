import { Router } from "express"
import protect from "../middlewares/authMiddlware.js"
const router = Router()

router.get('/dashboard', protect, async (req, res) => {
    res.json({ message: `Welcome  Home` })
})

export default router