import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';

const protect = async (req, res, next) => {
    const token = req.cookies.token; // get token from cookies

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // verify the token from cookie
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(401).json({ message: 'Invalid token: no user ID' });
        }

        // get user info from DB (excluding password)
        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        req.user = user;
        next(); // let the user in
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired, please log in again' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Not authorized' });
    }
};

export default protect;
