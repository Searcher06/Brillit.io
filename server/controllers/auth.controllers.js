import { userModel } from "../models/user.model.js"
import bcrypt from 'bcrypt'

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
            email: (await user).email
        })

    } else {
        res.status(400)
        throw new Error("invalid user data")
    }


}

export const signIn = async (req, res) => {
    const { email, password } = req.body

    // if (!email || !password) {
    //     res.status(400)
    //     throw new Error("Please add all fields")
    // }

    const user = await userModel.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: (await user)._id,
            username: (await user).username,
            email: (await user).email
        })
    } else {
        res.status(400)
        throw new Error("Invalid user credentials")
    }

}

export const signOut = (req, res) => {
    res.send("Sign Out")
}