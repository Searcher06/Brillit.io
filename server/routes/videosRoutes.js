import express from 'express'
import { searchVideos } from '../controllers/videosSearch.js'
import { videoId } from '../controllers/videoID.js'
const router = express.Router()

router.get('/search', searchVideos)

router.get('/:id', videoId)

export default router