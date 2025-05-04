import axios from 'axios'
import dontenv from 'dotenv'
dontenv.config()
const key = process.env.API_KEY

export const videoId = async (req, res) => {
    const id = req.params.id


    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                id,
                key,
            }
        })

        const channelId = await response.data.items[0].snippet.channelId
        const title = await response.data.items[0].snippet.title

        const response2 = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                channelId: channelId,
                type: 'video',
                key,
            }
        });


        const channelVideos = await response2.data

        const response3 = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: title,
                type: "video",
                maxResults: 20,
                key,
            }
        })

        const recommendedVideos = await response3.data

        res.status(200).json({
            channelVideos,
            recommendedVideos,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}