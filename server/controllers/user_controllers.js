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
const { signToken, signTokenForResettingPassword} = require("../jwt_middleware")
const nodemailer = require("nodemailer"); // for sending emails

/**
 * if the user does not exist yet, register the user in the database,
 * if the user exists, login the user
 */
const googleLoginUser = asyncHandler(async (req, res) => {
    const { email, username, googleId } = req.body
    let user = await User.findOne({ email })
    const userNameExists = await User.findOne({ username })
    if (!user && !userNameExists) {
        const salt = await bcrypt.genSalt(10)
        const hashed_password = await bcrypt.hash(googleId, salt)
        user = await User.create({
            email: email,
            username: username,
            password: hashed_password,
            googleSignedIn: true
        })
    }

    if (user && userNameExists && (await bcrypt.compare(googleId, user.password))) {
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

/**
 * 
 * @desc forgotPassword
 * @route POST /users/forgotPassword
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email  } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (user.googleSignedIn === true){
            
        }
        const token = signTokenForResettingPassword(user._id)
        let emailText = '' 
        if (process.env.NODE_ENV === 'production'){
            emailText = `https://geowizard-app-b802ae01ce7f.herokuapp.com/changeYourPassword/${user._id}/${user.username}/${token}`
        }
        else {
            emailText = `http://localhost:3000/changeYourPassword/${user._id}/${user.username}/${token}`
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'geowizard416@gmail.com',
                pass: 'gagi fqci aeqz kkns'
            }
        });

        const mailOptions = {
            from: 'geowizard416@gmail.com',
            to: email,
            subject: 'Resetting GeoWizard Password',
            text: emailText
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({ message: "Email Was Sent" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * 
 * @desc Reset password to the new password
 * @route PUT /users/resetPassword/:id/:token
 */
const resetPassword = asyncHandler(async (req, res) => {
    const { id } = req.params
    const {password} = req.body
    const user = await User.findById(id);
    console.log("HI1")
    console.log(user.username)
    console.log("HI2")
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        user.password = hashedPassword
        await user.save()
    } catch (error){
        return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({
        message: "Password has been changed successfully"
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
    updateUserInfo,
    forgotPassword,
    resetPassword
}
