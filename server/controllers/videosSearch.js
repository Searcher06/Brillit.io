import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
const key = process.env.API_KEY
import { videoModel } from '../models/video.model.js'
import client from '../config/typesenseClient.js'

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



    // checking typesense
    try {
        const searchResults = await client.collections('videos').documents().search({
            q: query,
            query_by: 'title,description,channel,tags',
            sort_by: 'views:desc',
        })

        // checking if the result is < 2 || nothing (call the youtube api)
        if (searchResults.hits.length < 5 || null) {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    q: query,
                    part: 'id',
                    type: 'video',
                    maxResults: 30,
                    key,

                }
            })

            // getting the video ID's
            const ids = await response.data.items.map((current) => {
                return current.id.videoId
            }).toString()

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
            // res.status(200).json(filtered)

            // storing the youtube response in db
            const videoResult = filtered.forEach((element) => {
                videoModel.create({
                    youtubeId: element.id.videoId,
                    title: element.snippet.title,
                    description: element.snippet.description,
                    channelTitle: element.snippet.channelTitle,
                    channelId: element.snippet.channelId,
                    thumbnails: element.snippet.thumbnails,
                    tags: element.snippet.tags,
                    category: element.snippet.category === '27' ? 'Education' : element.snippet.category === '28' ? 'Science and technology' : '',
                    publishedAt: element.snippet.publishedAt,
                    duration: element.contentDetails.duration,
                    searchTerms: query,
                    curated: true,
                    addedBySearch: true,
                    createdAt: Date.now(),

                })
            })

            await client.collections('videos').documents.create({

            })

            if (videoResult) {
                res.status(200).json(videoResult)
            }


        }


        // console.log(searchResults.hits)
        // res.status(200).json(searchResults.hits.map((current) => current.document))
    } catch (error) {
        console.log('search error: ', error)
        res.status(500)
        throw new Error("Internal error")
    }



}