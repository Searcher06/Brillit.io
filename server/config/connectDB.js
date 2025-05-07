import mongoose from 'mongoose'

const connectDB = async (DATABASE_URI) => {
    try {
        await mongoose.connect(DATABASE_URI)
        console.log(`Database Connected Successfully ... 😎`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB