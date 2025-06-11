import { userModel } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cloudinary from '../config/cloudinary.js'

export const signUp = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        res.status(400)
        throw new Error("Please add all fields")
    }

    // check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        res.status(400)
        throw new Error("Please enter a valid email")
    }

    // check if user exists
    const userExists = await userModel.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // check if username is < 4
    if (username.length < 4) {
        res.status(400)
        throw new Error("Name must be greater than 3 characters length")
    }

    // check if password is < 5
    if (password.length < 5) {
        res.status(400)
        throw new Error("Password must be greater than 5 characters length")
    }





    const salt = await bcrypt.genSalt(10)
    const hashedpwd = await bcrypt.hash(password, salt)

    const user = userModel.create({
        username,
        email,
        password: hashedpwd,
    })

    if (user) {
        res.status(201).json({
            _id: (await user)._id,
            username: (await user).username,
            email: (await user).email,
            token: generateToken((await user).id)
        })
        console.log(user)

    } else {
        res.status(400)
        throw new Error("invalid user data")
    }


}

export const signIn = async (req, res) => {
    const { email, password } = req.body

    const condition = (!email || !password) || (!email && !password)

    if (condition) {
        res.status(400)
        throw new Error("Please add all fields")
    }



    const user = await userModel.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: (await user)._id,
            username: (await user).username,
            email: (await user).email,
            token: generateToken((await user).id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid user credentials")
    }

}

// Generate jwt token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

export const getMe = async (req, res) => {
    const { _id, username, email } = await userModel.findById(req.user.id)
    res.status(200)
    res.json({
        id: _id,
        username,
        email,
    })
}

export const updateProfile = async (req, res) => {
    const { profilePic } = req.body
    if (!profilePic) {
        res.status(400)
        throw new Error('Profile pic is required')
    }

    const userID = req.user._id

    try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await userModel.findByIdAndUpdate(userID, {
            profilePic: uploadResponse.secure_url
        }, { new: true })

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log('Error in update profile controller', error)
        res.status(500)
        throw new Error('Internal Server error')
    }

}

export const signOut = (req, res) => {
    res.send("Sign Out")
}