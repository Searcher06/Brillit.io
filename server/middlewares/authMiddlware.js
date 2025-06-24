import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';

const protect = async (req, res, next) => {
    const token = req.cookies.token; // get token from cookies

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        // verify the token from cookie
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            res.status(401);
            throw new Error('Invalid token: no user ID');
        }

        // get user info from DB (excluding password)
        req.user = await userModel.findById(decoded.id).select('-password');
        console.log(req.user)
        console.log('Cookies:', req.cookies);
        console.log('Token:', req.cookies.token);


        next(); // let the user in 🟢
    } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
};

export default protect;
