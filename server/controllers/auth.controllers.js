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

    if (firstName.includes(' ') || lastName.includes(' ')) {
        res.status(400)
        throw new Error("No whitespaces allowed for Firstname and Lastname")
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
        throw new Error("Use of special characters is not allowed for Firstname and Lastname")
    }


    const salt = await bcrypt.genSalt(12)
    const hashedpwd = await bcrypt.hash(password, salt)

    const user = await userModel.create({
        firstName,
        lastName,
        email,
        password: hashedpwd,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
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



    let user = await userModel.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        user = await userModel.findOne({ email }).select('-password')
        generateTokenAndSetCookie(user, res)
        res.status(200).json(user)
    } else {
        res.status(400)
        throw new Error("Invalid user credentials")
    }

}

// Generate jwt token
const generateTokenAndSetCookie = (user, res) => {
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only true on live site
        sameSite: 'Lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};



export const getMe = async (req, res) => {
    const { _id, firstName, lastName, email } = await userModel.findById(req.user.id);
    return res.status(200).json({
        id: _id,
        firstName,
        lastName,
        email,
    });
};


export const updateProfile = async (req, res) => {
    try {
        const { newFirstName, newLastName, newPassword, oldPassword } = req.body;
        const userID = req.user._id;
        const user = await userModel.findById(userID);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        // Validate & update name
        const symbols = ['`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '/', '[', ']', '{', '}', '|', ",", "'", `"`, '.', '?'];
        const contains = symbols.some(symbol =>
            newFirstName?.includes(symbol) || newLastName?.includes(symbol)
        );

        if (newFirstName || newLastName) {
            if (newFirstName?.length < 3) throw new Error('Firstname must be at least 3 characters');
            if (newLastName?.length < 3) throw new Error('Lastname must be at least 3 characters');
            if (newFirstName?.length > 25) throw new Error('Firstname is too long (25 max)');
            if (newLastName?.length > 25) throw new Error('Lastname is too long (25 max)');
            if (contains) throw new Error('Special characters are not allowed in names');

            user.firstName = newFirstName || user.firstName;
            user.lastName = newLastName || user.lastName;
        }

        // Validate & update password
        if (newPassword) {
            if (!oldPassword) throw new Error("Please fill in the old password");
            const isPwdMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isPwdMatch) throw new Error("Old password is incorrect");
            if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");

            user.password = await bcrypt.hash(newPassword, 12);
        }

        // Handle image if uploaded
        const file = req.file;
        if (file) {
            const base64 = file.buffer.toString('base64');
            const dataUri = `data:${file.mimetype};base64,${base64}`;

            const uploadResult = await cloudinary.uploader.upload(dataUri, {
                folder: 'profile_pics'
            });

            user.profilePic = uploadResult.secure_url;
        }

        await user.save();


        const updatedUser = await userModel.findById(userID).select('-password');
        res.status(200).json(updatedUser);

    } catch (error) {
        if (error.name === 'TimeoutError') {
            res.status(500).json({ message: "Network error. Try again" })
        } else if (error.name === 'ECONNABORTED') {
            res.status(500).json({ message: "Network issue. Please check your connection and try again" })
        } else {
            console.error("Update profile error:", error);
            res.status(400).json({ message: error.message || "Internal server error" });
        }

    }
};

export const signOut = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out' });
}