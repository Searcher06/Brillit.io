import mongoose from 'mongoose';


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


export const insertVideo = async () => {
    try {
        const v1 = new videoModel({
            youtubeId: "PkZNo7MFNFg",
            title: "Learn JavaScript - Full Course for Beginners",
            description: "This complete tutorial covers everything you need to know to get started with JavaScript.",
            channelTitle: "freeCodeCamp.org",
            channelId: "UC8butISFwT-Wl7EV0hUK0BQ",
            thumbnails: {
                default: "https://i.ytimg.com/vi/PkZNo7MFNFg/default.jpg",
                medium: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg",
                high: "https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg"
            },
            tags: ["javascript", "programming", "web development"],
            category: "Education",
            publishedAt: "2018-12-10T00:00:00Z",
            duration: "PT3H26M",
            viewCount: 25000000,
            likeCount: 900000,
            favoriteCount: 0,
            commentCount: 25000,
            searchTerms: [
                "javascript course",
                "freecodecamp",
                "learn javascript",
                "javascript by freecodecamp"
            ],
            curated: false,
            addedBySearch: true,
            createdAt: "2025-05-11T18:00:00Z"
        }
        )
        const v2 = new videoModel({
            youtubeId: "w7ejDZ8SWv8",
            title: "React JS Crash Course 2021",
            description: "Get started with React by building a simple project in this crash course from Traversy Media.",
            channelTitle: "Traversy Media",
            channelId: "UC29ju8bIPH5as8OGnQzwJyA",
            thumbnails: {
                default: "https://i.ytimg.com/vi/w7ejDZ8SWv8/default.jpg",
                medium: "https://i.ytimg.com/vi/w7ejDZ8SWv8/mqdefault.jpg",
                high: "https://i.ytimg.com/vi/w7ejDZ8SWv8/hqdefault.jpg"
            },
            tags: ["react", "reactjs", "frontend", "javascript", "crash course"],
            category: "Education",
            publishedAt: "2021-01-18T00:00:00Z",
            duration: "PT2H",
            viewCount: 5300000,
            likeCount: 180000,
            favoriteCount: 0,
            commentCount: 12500,
            searchTerms: [
                "react crash course",
                "react js traversy",
                "learn react 2021",
                "react frontend tutorial"
            ],
            curated: false,
            addedBySearch: true,
            createdAt: "2025-05-11T18:10:00Z"
        }
        )

        const result = await videoModel.insertMany([v1, v2])
        console.log(result)
    } catch (error) {
        console.log('Error connecting to DB', error)
    }
}
