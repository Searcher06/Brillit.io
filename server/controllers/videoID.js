import axios from 'axios'
import dontenv from 'dotenv'
import { videoModel } from '../models/video.model.js'
dontenv.config()
const key = process.env.API_KEY

export const videoId = async (req, res) => {
    const id = req.params.id


    try {
        // const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        //     params: {
        //         part: 'snippet',
        //         id,
        //         key,
        //     }
        // })

        // Finding the video using youtube Id from the DB
        const videoInfo = await videoModel.find({ youtubeId: id })

        // Getting the video channelID from the videoInfo variable
        const channelId = await videoInfo.channelId

        // Getting the video title from videoInfo
        const title = await videoInfo.title

        // Hitting the youtube API to get videos from the same channel
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                channelId: channelId,
                type: 'video',
                key,
            }
        });

        // Storing the channel videos
        const channelVideos = await response.data


        const response2 = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: title,
                type: "video",
                maxResults: 20,
                key,
            }
        })

        const recommendedVideos = await response2.data

        res.status(200).json({
            channelVideos,
            recommendedVideos,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}