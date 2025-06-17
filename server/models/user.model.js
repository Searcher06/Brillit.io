import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
// Defining a Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Firstname is required"],
        trim: true,
    },

    lastName: {
        type: String,
        required: [true, "Lastname is required"],
        trim: true,
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },

    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 6,
    },

    profilePic: {
        type: String,
        default: ''
    },

    suggestedKeywords: { type: Array },

    createdAt: {
        type: Date,
        default: Date.now
    },

})

// Creating a model
export const userModel = mongoose.model('User', userSchema)

// Creating a new document

export const createUser = async () => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedpwd = await bcrypt.hash('ahmadibrahim2006', salt)
        const u1 = new userModel({
            username: "johndoe",
            email: "john123@gmail.com",
            password: hashedpwd,
        })
        // const result = await u1.save()
        // console.log(result)
    } catch (error) {
        console.log('Error connecting to database', error)
    }
}

