import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
const port = process.env.PORT
import videos from '../routes/videosRoutes.js'
import connectDB from '../config/connectDB.js'
const DATABASE_URI = process.env.DATABASE_URI
import router from '../routes/userRoutes.js'
import Logger from '../middlewares/logger.js'
import { errorHandler } from '../middlewares/errorhandler.js'
import { insertVideo, videoModel } from '../models/video.model.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(Logger)

app.use('/api/videos/', videos,)
app.use('/api/v1/users', router)




connectDB(DATABASE_URI)
// insertVideo()


app.use(errorHandler)
app.listen(port, '0.0.0.0', () => {
    console.log("Server up and running on port:" + port)
})