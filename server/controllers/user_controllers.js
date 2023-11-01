/**
 * Controller functions for handling users
 * For testing post requests, set the Content-type of the request header to "application/json" 
 * and send the request body as JSON
 * 
 * For testing getUser, paste the user token in the authorization header for type "Bearer Token" 
 * @author Kahui Wong
 */
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require('express-async-handler')
const User = require("../models/user_model")
const { signToken } = require("../jwt_middleware")
/**
 * 
 * @desc authenticate and login new user
 * @route POST /users/login
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // checks if the request contains all required fields
    if (!email || !password) {
        res.status(400)
        throw new Error("Missing required fields for login")
    }

    // finds the user with the correct password 
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: signToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error("Invalid credentials")
    }
})

/**
 * 
 * @desc Register new user
 * @route POST /users/register
 */
const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body

    // checks if the request contains all required fields
    if (!email || !username || !password) {
        res.status(400)
        throw new Error("Missing required fields for register")
    }

    // checks if users exists in the database
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // hash password with generated salt
    const salt = await bcrypt.genSalt(10)
    const hashed_password = await bcrypt.hash(password, salt)

    // create the user and store its hashed password
    const user = await User.create({
        email,
        username,
        password: hashed_password
    })

    // genreate token for the user
    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: signToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error("Invalid user")
    }
})

/**
 * 
 * @desc Retrieve user data (for testing token verification)
 * @route GET /users/me
 */
const getUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})


module.exports = {
    registerUser,
    loginUser,
    getUser
}