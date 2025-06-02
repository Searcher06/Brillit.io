import typesense from 'typesense'
import mongoose from "mongoose";
import client from "./typesenseClient.js";
import dotenv from 'dotenv'
import { videoModel } from "../models/video.model.js";
dotenv.config()


const schema = {
    name: 'videos',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', optional: true },
        { name: 'url', type: 'string' },
        { name: 'channel', type: 'string' },
        { name: 'tags', type: 'string[]', optional: true },
        { name: 'views', type: 'int32' },
        { name: 'createdAt', type: 'int64', optional: true },
        { name: 'publishedAt', type: 'int64', optional: true },
    ],
    default_sorting_field: 'views',
}


async function setupTypesense() {
    try {
        await client.collections('videos').retrieve();
        console.log('Collection already exists');
    } catch (err) {
        if (err.constructor.name === 'ObjectNotFound') {
            await client.collections().create(schema);
            console.log('reated videos collection');
        } else {
            console.error('Error checking collection:', err);
        }
    }
}

export async function seedTypeSense() {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
        const videos = await videoModel.find({})

        const formatted = videos.map((video) => ({
            id: video.youtubeId,
            title: video.title || "",
            description: video.description || '',
            url: `https://youtube.com/watch?v=${video.youtubeId}`,
            channel: video.channelTitle,
            tags: video.tags || [],
            views: video.viewCount || 0,
            publishedAt: video.publishedAt ? new Date(video.publishedAt).getTime() : Date.now(),
            createdAt: video.createdAt ? new Date(video.createdAt).getTime() : Date.now(),
        }))

        const result = await client.collections('videos').documents().import(formatted, { action: 'upsert' })

        console.log('Typesense seeded')
        console.log(result)
    } catch (error) {
        console.log('Error in seeding typesense', error)
    }
}

export const deleteDocuments = async () => {
    try {
        await client.collections('videos').delete()
        console.log('All documents in "videos" deleted')
    } catch (error) {
        console.log("Error in deleting docs", error)
    }
}

export const insertToTypesense = async (savedVideos) => {
    try {
        const typesenseFormat = savedVideos.map((current) => ({
            id: current.id,
            title: video.snippet.title,
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
        console.log('insertToTypesense error : ', error)
    }
}
// setupTypesense();

export const getAllDocs = async (req, res) => {
    try {
        const documents = await client.collections('videos').documents().export()
        console.log('Fetched all the docs successfully from typesense ')
        res.status(200).json(documents)
    } catch (error) {
        console.log('Error in getting docs : ', error)
    }
}

export default setupTypesense;
