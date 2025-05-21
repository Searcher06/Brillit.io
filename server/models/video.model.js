import mongoose from 'mongoose';
import { dummyVideos } from '../lib/videoSeeder.js';

const videoSchema = new mongoose.Schema({
    youtubeId: {
        type: String,
        required: true,
        unique: true,
    },
    title: String,
    description: String,
    channelTitle: String,
    channelId: String,
    thumbnails: {
        default: String,
        medium: String,
        high: String,
    },
    tags: [String],
    category: String,
    publishedAt: Date,
    duration: String, // ISO 8601 e.g. "PT10M34S"
    viewCount: Number,
    likeCount: Number,
    favoriteCount: Number,
    commentCount: Number,
    searchTerms: [String], // e.g. ['javascript', 'huxn web dev']
    curated: {
        type: Boolean,
        default: false,
    },
    addedBySearch: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const videoModel = mongoose.model('Video', videoSchema)


export const seedDB = async () => {
    try {
        const result = await videoModel.insertMany(dummyVideos)
        console.log(`Seeded ${dummyVideos.length} videos to mongoDB`)
    } catch (error) {
        console.log('Error connecting to DB', error)
    }
}
