import express from 'express'
import { videoSearch } from '../controllers/videosSearch.js'
import { videoId } from '../controllers/videoID.js'
const router = express.Router()

router.get('/search', videoSearch)

router.get('/:id', videoId)

export default router