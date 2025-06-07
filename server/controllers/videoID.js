import axios from 'axios'
import dontenv from 'dotenv'
import { videoModel } from '../models/video.model.js'
import client from '../config/typesenseClient.js'
import { getVideosFromMongo } from '../lib/getVideosfromDB.js'
dontenv.config()
const key = process.env.API_KEY

export const videoId = async (req, res) => {
    const id = req.params.id
    const query = req.query.q

    try {
        // Finding the video using youtube Id from the DB
        const videoInfo = await videoModel.findOne({ youtubeId: id })

        // Getting the video channelId from the videoInfo variable
        const channelId = await videoInfo.channelId
        console.log(channelId)

        // Hitting the youtube API to get videos from the same channel (IDs)
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                channelId: channelId,
                type: 'video',
                key,
                order: 'date',
                maxResults: 15,
                type: 'video',
            }
        });

        // Getting the video IDs from the first API call
        const videoIds = response.data.items.map(item => item.id.videoId).join(',');

        const videoRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                key,
                id: videoIds,
                part: 'snippet,contentDetails' // get all the good stuff
            }
        });

        // Storing the channel videos in a variable
        const channelVideos = await videoRes.data

        // Searching recommended videos from typesense
        const recommendedTypesense = await client.collections('videos').documents().search({
            q: query,
            query_by: 'title,channel,tags',   // if the problem persist remove 'tags'
            query_by_weights: "5,2,1",
            sort_by: 'views:desc',
        })

        // getting the vidoes IDs
        const ids = recommendedTypesense.hits.map(hit => hit.document.id)

        // getting the recommended videos from the DB by their IDs
        const recommendedDB = await getVideosFromMongo(ids)

        const recommendedVideos = recommendedDB

        res.status(200).json({
            channelVideos,
            recommendedVideos,
        })
    } catch (error) {
        res.status(500)
        console.log('Error in youtube ID controller : ', error)
        throw new Error('Internal error')
    }
}