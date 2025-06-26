import { Router } from "express"
import protect from "../middlewares/authMiddlware.js"
const router = Router()

router.get('/dashboard', protect, async (req, res) => {
    res.json({ message: `Welcome  ${await req.user.firstName}` })
})

export default router