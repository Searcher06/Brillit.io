import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
const key = process.env.API_KEY
import { videoModel } from '../models/video.model.js'

export const videoSearch = async (req, res) => {
    const query = req.query.q

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                q: query,
                part: 'id',
                type: 'video',
                maxResults: 30,
                key,

            }
        })

        const ids = await response.data.items.map((current) => {
            return current.id.videoId
        }).toString()

        // if (!ids) {
        //     return res.status(404).json({ message: "No videos found for this query" })
        // }

        const response2 = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,contentDetails',
                id: ids,
                key,

            }
        })

        const filtered = await response2.data.items.filter((current) => {
            return current.snippet.categoryId === '26' || current.snippet.categoryId === '27'
        })
        res.status(200).json(filtered)
    } catch (error) {
        res.status(500).json(error)
    }


}

export const searchVideos = async (req, res) => {

    // Getting the search query
    const query = req.query.q

    // Checking the search query
    if (!query) {
        res.status(400)
        throw new Error("Empty search query")
    }







}