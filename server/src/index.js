import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
const port = process.env.PORT
import videos from '../routes/videosRoutes.js'
import connectDB from '../config/connectDB.js'
const DATABASE_URI = process.env.DATABASE_URI
import router from '../routes/userRoutes.js'
import Logger from '../middlewares/logger.js'
import { errorHandler } from '../middlewares/errorhandler.js'
import { seedDB, videoModel } from '../models/video.model.js'
import setupTypesense, { deleteDocuments } from '../config/setUpTypesense.js'
import { seedTypeSense } from '../config/setUpTypesense.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(Logger)

app.use('/api/v1/videos/', videos,)
app.use('/api/v1/users', router)




connectDB(DATABASE_URI)
// seedDB()
// setupTypesense()
// deleteDocuments()
// seedTypeSense()



app.use(errorHandler)
app.listen(port, '0.0.0.0', () => {
    console.log("Server up and running on port 😎 : " + port)
})