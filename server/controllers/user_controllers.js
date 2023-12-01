/**
 * Controller functions for handling users
 * For testing post requests, set the Content-type of the request header to "application/json" 
 * and send the request body as JSON
 * 
 * For testing getUser, paste the user token in the authorization header for type "Bearer Token" 
 * @author Kahui Wong
 */
const bcrypt = require("bcryptjs")
const asyncHandler = require('express-async-handler')
const User = require("../models/user_model")
const { signToken } = require("../jwt_middleware")

/**
 * if the user does not exist yet, register the user in the database,
 * if the user exists, login the user
 */
const googleLoginUser = asyncHandler(async (req, res) => {
    const { email, username, googleId } = req.body
    let user = await User.findOne({ email })
    if (!user) {
        const salt = await bcrypt.genSalt(10)
        const hashed_password = await bcrypt.hash(googleId, salt)
        user = await User.create({
            email: email,
            username: username,
            password: hashed_password
        })
    }

    if (user && (await bcrypt.compare(googleId, user.password))) {
        return res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: signToken(user._id),
        })
    } else {
        return res.status(401).json({ // 401 Unauthorized
            message: "Invalid credentials"
        })
    }
})


/**
 * 
 * @desc authenticate and login new user
 * @route POST /users/login
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // checks if the request contains all required fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Missing required fields for login"
        })
    }

    // finds the user with the correct password 
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        return res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: signToken(user._id),
        })
    } else {
        return res.status(401).json({ // 401 Unauthorized
            message: "Invalid credentials"
        })
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
        return res.status(400).json({   // 400 for missing required fields
            message: "Missing required fields for register"
        })
    }

    // checks if email exists in the database
    const emailExists = await User.findOne({ username })

    // checks if users exists in the database
    const userExists = await User.findOne({ email })

    if (emailExists) {
        return res.status(409).json({
            message: "Email already exists"
        })
    }

    if (userExists) {
        return res.status(409).json({
            message: "User already exists"
        })
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
        return res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: signToken(user._id),
        })
    }
})

/**
 * 
 * @desc Retrieve user data (for testing token verification)
 * @route GET /users/me
 */
const getUser = asyncHandler(async (req, res) => {
    return res.status(200).json(req.user)
})

/**
 * 
 * @desc Checks if email is already in the db
 * @route GET /users/checkUniqueEmail
 */
const checkUniqueEmail = asyncHandler(async (req, res) => {

    const { email } = req.query

    // checks if users exists in the database
    const userExists = await User.findOne({ email })

    if (userExists) {
        return res.status(409).json({ // Use status 409 for conflict
            message: "Email already exists"
        })
    }

    return res.status(200).json({
        message: "Email is unique"
    })
})

/**
 * 
 * @desc Checks if email is already in the db
 * @route GET /users/checkUniqueUser
 */
const checkUniqueUser = asyncHandler(async (req, res) => {

    const { username } = req.query

    // check if username exists in the database
    const userNameExists = await User.findOne({ username })

    if (userNameExists) {
        return res.status(409).json({ // Use status 409 for conflict
            message: "User already exists"
        })
    }

    return res.status(200).json({
        message: "User is unique"
    })
})


const getUserById = asyncHandler(async (req, res) => {

    const id = req.params.id

    // check if username exists in the database
    const user = await User.findById(id)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    return res.status(200).json(user)
})


const updateUserInfo = asyncHandler(async (req, res) => {
    const { field, value } = req.body
    const user = req.user
    if (!user) {
        return res.status(401).json({
            message: "Invalid user credentials"
        })
    }

    if (!(field in user)) {
        return res.status(400).json({
            message: `field ${field} does not exist`
        })
    }

    // if (typeof value !== typeof user[field]) {
    //     return res.status(400).json({
    //         message: `type mismatch for value ${value} and field ${field}`
    //     })
    // }

    user[field] = value
    const savedUser = await user.save()

    if (savedUser) {
        return res.status(200).json({
            user: user,
            value: user[field]
        })
    }

    else {
        return res.status(500).json({
            message: "updateUserInfo failed"
        })
    }
})


module.exports = {
    registerUser,
    loginUser,
    getUser,
    googleLoginUser,
    checkUniqueEmail,
    checkUniqueUser,
    getUserById,
    updateUserInfo
}
