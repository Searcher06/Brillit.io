import express from 'express'
import { videoSearch } from '../controllers/videosSearch.js'
import { videoId } from '../controllers/videoID.js'
import protect from '../middlewares/authMiddlware.js'
const router = express.Router()

router.get('/search', protect, videoSearch)

router.get('/:id', protect, videoId)

export default router