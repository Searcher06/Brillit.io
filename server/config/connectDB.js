import mongoose from 'mongoose'

const connectDB = async (DATABASE_URI) => {
    try {
    const conn = await mongoose.connect(DATABASE_URI)
        console.log(`mongoDB connected to : ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB