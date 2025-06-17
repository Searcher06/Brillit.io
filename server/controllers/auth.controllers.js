import { userModel } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cloudinary from '../config/cloudinary.js'

export const signUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
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

    // check if firstname is < 3
    if (firstName.length < 3) {
        res.status(400)
        throw new Error("Firstname must be atleast 3 characters length")
    }

    // check if lastname is < 3
    if (lastName.length < 3) {
        res.status(400)
        throw new Error("Lastname must be atleast 3 characters length")
    }

    // check if password is < 5
    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be atleast 6 characters length")
    }


    let contains
    const symbols = ['`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '/', '[', ']', '{', '}', '|', ",", "'", `"`, '.', '?']
    symbols.forEach((current) => {
        if (firstName.includes(current) || lastName.includes(current)) {
            contains = true
            return
        }
    })

    if (contains) {
        res.status(400)
        throw new Error("use of special characters is not allowed for firstname and lastname")
    }


    const salt = await bcrypt.genSalt(10)
    const hashedpwd = await bcrypt.hash(password, salt)

    const user = userModel.create({
        firstName,
        lastName,
        email,
        password: hashedpwd,
    })

    if (user) {
        res.status(201).json({
            _id: (await user)._id,
            firstName: (await user).firstName,
            lastName: (await user).lastName,
            email: (await user).email,
            token: generateToken((await user).id, (await user).firstName, (await user).lastName, (await user).email)
        })

    } else {
        res.status(400)
        throw new Error("Invalid user data")
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
            firstName: (await user).firstName,
            lastName: (await user).lastName,
            email: (await user).email,
            token: generateToken((await user).id, (await user).firstName, (await user).lastName, (await user).email)
        })
    } else {
        res.status(400)
        throw new Error("Invalid user credentials")
    }

}

// Generate jwt token
const generateToken = (id, firstName, lastName, email) => {
    return jwt.sign({ id, firstName, lastName, email }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

export const getMe = async (req, res) => {
    const { _id, firstName, lastName, email } = await userModel.findById(req.user.id)
    res.status(200)
    res.json({
        id: _id,
        firstName,
        lastName,
        email,
    })
}

export const updateProfile = async (req, res) => {
    // const { profilePic } = req.body
    // if (!profilePic) {
    //     res.status(400)
    //     throw new Error('Profile pic is required')
    // }

    // const userID = req.user._id

    // try {
    //     const uploadResponse = await cloudinary.uploader.upload(profilePic)

    //     const updatedUser = await userModel.findByIdAndUpdate(userID, {
    //         profilePic: uploadResponse.secure_url
    //     }, { new: true })

    //     res.status(200).json(updatedUser)
    // } catch (error) {
    //     console.log('Error in update profile controller', error)
    //     res.status(500)
    //     throw new Error('Internal Server error')
    // }

    const { newFirstName, newLastName, newPassword, oldPassword } = req.body
    const userID = req.user._id
    const user = await userModel.findOne({ _id: userID })

    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }

    let contains
    const symbols = ['`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '/', '[', ']', '{', '}', '|', ",", "'", `"`, '.', '?']
    symbols.forEach((current) => {
        if (newFirstName.includes(current) || newLastName.includes(current)) {
            contains = true
            return
        }
    })

    if (newFirstName || newLastName) {
        if (newFirstName.length < 5) {
            res.status(400)
            throw new Error('Firstname must be atleast 5 characters long')
        } else if (newLastName.length < 5) {
            res.status(400)
            throw new Error('Lastname must be atleast 5 characters long')
        }
        else if (newFirstName.length > 25) {
            res.status(400)
            throw new Error(`Firstname is too long. Firstname is 25 characters max`)
        } else if (newLastName.length > 25) {
            res.status(400)
            throw new Error(`Lastname is too long. Lastname is 25 characters max`)
        }
        else if (contains) {
            res.status(400)
            throw new Error("Use of special characters is not allowed\n for Firstname and Lastname")
        } // remaining \
        user.firstName = newFirstName
        user.lastName = newLastName
    }

    if (newPassword) {
        const isPwdMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isPwdMatch) {
            res.status(400)
            throw new Error('Old password is incorrect')
        } else if (newPassword.length < 6) {
            res.status(400)
            throw new Error('Password must be atleast 6 characters long')
        } else if (!oldPassword) {
            res.status(400)
            throw new Error("Please fill fill in the old password")
        }
        user.password = await bcrypt.hash(newPassword, 12)
    }


    try {
        user.save()
        res.status(200).json({ message: "Profile updated successfully", user })
    } catch (error) {
        console.log("Error in update profile controller : ", error)
        res.status(500)
        throw new Error("Internal error")
    }

}

export const signOut = (req, res) => {
    res.status(200).send("Sign out")
}