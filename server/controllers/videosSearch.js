import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
const key = process.env.API_KEY
import { videoModel } from '../models/video.model.js'
import client from '../config/typesenseClient.js'
import { fetchYouTubeVideos } from '../lib/fetchYoutube.js'
import { getVideosFromMongo } from '../lib/getVideosfromDB.js'

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



    try {
        const searchResults = await client.collections('videos').documents().search({
            q: query,
            query_by: 'title,description,channel,tags',
            sort_by: 'views:desc',
        })

        // checking if the result is < 2 || nothing (call the youtube api)
        if (searchResults.hits.length < 2 || null) {

            const freshVideos = await fetchYouTubeVideos(query, res)
            // let savedVideos;

            // if (freshVideos) {
            //     savedVideos = await videoModel.insertMany(freshVideos)
            // }


            // if (savedVideos) {
            //     // formating the fresh videos from the youtube API response
            //     const typesenseFormat = freshVideos.map((current) => ({
            //         id: current.id.videoId,
            //         title: video.snippet.title,
            //         description: video.snippet.description || '',
            //         url: `https://youtube.com/watch?v=${current.id.videoId}`,
            //         channel: current.snippet.channelTitle,
            //         tags: current.snippet.tags || [],
            //         createdAt: current.snippet.publishedAt ? new Date(current.snippet.publishedAt).getTime() : Date.now()
            //     }))

            //     // storing videos in typesense
            //     const typesenseResult = await client.collections('videos').documents().import(typesenseFormat, { action: 'upsert' })
            //     console.log(typesenseResult)

            //     // returning the new saved vidoes to the client
            //     res.status(200).json(savedVideos)
            // }

            // storing the youtube response in db
            // const insertingVideos = freshVideos.forEach((element) => {
            //     videoModel.create({
            //         youtubeId: element.id,
            //         title: element.snippet.title,
            //         description: element.snippet.description,
            //         channelTitle: element.snippet.channelTitle,
            //         channelId: element.snippet.channelId,
            //         thumbnails: element.snippet.thumbnails,
            //         tags: element.snippet.tags,
            //         category: element.snippet.category === '27' ? 'Education' : element.snippet.category === '28' ? 'Science and technology' : '',
            //         publishedAt: element.snippet.publishedAt,
            //         duration: element.contentDetails.duration,
            //         searchTerms: query,
            //         curated: true,
            //         addedBySearch: true,
            //         createdAt: Date.now(),

            //     })
            // })

            let savedVideos = [];

            if (freshVideos[0]) {
                const createVideoPromises = freshVideos.map(async (element) => {
                    try {
                        const video = await videoModel.create({
                            youtubeId: element.id,
                            title: element.snippet.title,
                            description: element.snippet.description,
                            channelTitle: element.snippet.channelTitle,
                            channelId: element.snippet.channelId,
                            thumbnails: {
                                default: element.snippet.thumbnails.default.url,
                                medium: element.snippet.thumbnails.medium.url,
                                high: element.snippet.thumbnails.high.url,
                            },
                            tags: element.snippet.tags,
                            category: element.snippet.category === '27'
                                ? 'Education'
                                : element.snippet.category === '28'
                                    ? 'Science and technology'
                                    : '',
                            publishedAt: element.snippet.publishedAt,
                            duration: element.contentDetails.duration,
                            searchTerms: query,
                            curated: true,
                            addedBySearch: true,
                            createdAt: Date.now(),
                        });

                        savedVideos.push(video);
                    } catch (err) {
                        if (err.code === 11000) {
                            console.log(`Duplicate video skipped: ${element.id}`);
                        } else {
                            console.error('Error creating video:', err);
                        }
                    }
                });

                await Promise.all(createVideoPromises);

                if (savedVideos) {
                    try {
                        const typesenseFormat = savedVideos.map((current) => ({
                            id: current.id,
                            title: current.snippet.title || '',
                            description: video.snippet.description || '',
                            url: `https://youtube.com/watch?v=${current.id.videoId}`,
                            channel: current.snippet.channelTitle,
                            tags: current.snippet.tags || [],
                            createdAt: current.snippet.publishedAt ? new Date(current.snippet.publishedAt).getTime() : Date.now()
                        }))

                        // storing videos in typesense
                        const typesenseResult = await client.collections('videos').documents().import(typesenseFormat, { action: 'upsert' })
                        console.log('Saved to typesense : ', typesenseResult)
                    } catch (error) {
                        console.log('Typesense insert error', error)
                    }
                }

                return res.status(200).json(savedVideos);
            }



        } else {
            const ids = searchResults.hits.map(hit => hit.document.id)

            const dbVideos = await getVideosFromMongo(ids)

            const typesenseVid = searchResults.hits.map(hit => hit.document)

            if (dbVideos) {
                res.status(200).json(dbVideos)
            }
        }


    } catch (error) {
        console.log('search error: ', error)
        res.status(500)
        throw new Error(error.message)
    }



}