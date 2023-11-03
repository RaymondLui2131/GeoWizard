/**
 * Middleware for protecting certain routes by checking for a valid JWT
 * in the 'authorization' header of the request
 * @author Kahui Wong
 */
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("./models/user_model")

const verifyToken = asyncHandler(async (req, res, next) => {
    let token

    // check if the request has an "authorization" header with a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // extract the token from the header
            token = req.headers.authorization.split(" ")[1]
            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
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
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
}


module.exports = { verifyToken, signToken }