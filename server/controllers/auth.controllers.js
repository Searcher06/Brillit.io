import { userModel } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        res.status(400)
        throw new Error("Please add all fields")
    }

    // check if user exists
    const userExists = await userModel.findOne({ email })
    const usernameExists = await userModel.findOne({ username })
    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // check if username available
    if (usernameExists) {
        res.status(400)
        throw new Error("username is not available")
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

export const signOut = (req, res) => {
    res.send("Sign Out")
}