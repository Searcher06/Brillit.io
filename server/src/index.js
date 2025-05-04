import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
const port = process.env.PORT
import videos from '../routes/videosRoutes.js'
const app = express()

app.use(cors())
app.use('/api/videos/', videos)


app.listen(port, () => {
    console.log("Server up and running on port:" + port)
})