/**
 * Middleware for protecting certain routes by checking for a valid JWT
 * in the 'authorization' header of the request
 * @author Kahui Wong
 */

require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET

const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("./models/user_model")

const verifyToken = asyncHandler(async (req, res, next) => {
    let token
    console.log("HI1")
    console.log(req.headers.authorization)
    console.log("HI2")
    // check if the request has an "authorization" header with a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // extract the token from the header
            token = req.headers.authorization.split(" ")[1]
            // verify the token
            const decoded = jwt.verify(token, jwtSecret)
            // find the user with the token
            req.user = await User.findById(decoded.id).select("-password")
            next()
        } catch (error) {
            res.status(401).json({
                message: "Not authorized, token failed"
            })
        }
    }
})

/**
 * 
 * @param {string} id id of the user
 * @returns a newly signed JWT string with a default expiration day of 30
 */
const signToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "30d"
    })
}

/**
 * 
 * @param {string} id id of the user
 * @returns a newly signed JWT string with a default expiration day of 30
 */
const signTokenForResettingPassword = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "15m"
    })
}

/**
 * 
 * @returns Middleware to verify password reset token
 */
const verifyResetToken = asyncHandler(async (req, res, next) => {
    const { id, token } = req.params;

    // Find the user based on the ID from the URL
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        if (decoded.id !== user._id.toString()) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});



module.exports = { verifyToken, signToken, signTokenForResettingPassword, verifyResetToken}