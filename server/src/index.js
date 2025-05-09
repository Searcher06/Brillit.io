import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
const port = process.env.PORT
import videos from '../routes/videosRoutes.js'
import connectDB from '../config/connectDB.js'
const DATABASE_URI = process.env.DATABASE_URI
import { createUser } from '../models/user.model.js'
import router from '../routes/userRoutes.js'
import Logger from '../middlewares/logger.js'
import { errorHandler } from '../middlewares/errorhandler.js'
const app = express()
// h
app.use(cors())
app.use(Logger)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api/videos/', videos,)
app.use('/api/v1/users', router)
app.get('/test',(req,res)=>{
  res.json({message:'hi bro'})
})



connectDB(DATABASE_URI)



app.use(errorHandler)
app.listen(port,'0.0.0.0', () => {
    console.log("Server up and running on port:" + port)
})