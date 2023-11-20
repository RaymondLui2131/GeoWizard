const asyncHandler = require('express-async-handler')
const User = require("../models/user_model")
const Comment = require("../models/comments_model")


/**
 * 
 * @desc adds user comment into the db
 * @route POST /comments/addComment
 */
const postComment = asyncHandler(async (req, res) => {
    const { text, user_id, map_id } = req.body

    // checks if the request contains all required fields
    if (!text || !user_id || !map_id ) {
        return res.status(400).json({
            message: "Missing required fields for posting a comment"
        })
    }

    // creates new comment
    const newComment = await Comment.create({
        text,
        user_id,
        map_id
    })

    // adds comment into the User's comments array
    const userExists = await User.findOne({ _id: user_id });
    
    if (userExists) {
        userExists.comments.push(userExists.id);
        await userExists.save();    
    }
    else {
        return res.status(400).json({
            message: "User not found"
        })
    }

    if (newComment) {
        return res.status(200).json({
            _id: newComment.id,
            text: newComment.text,
            user_id: newComment.user_id,
            map_id: newComment.map_id
        })
    }
    
})


/**
 * 
 * @desc Given a comment_id get the comment
 * @route GET /comments/getComment
 */
const getComment = asyncHandler(async (req, res) => {
    const { comment_id } = req.body

    // checks if the comment exists in the database
    const commentExists = await Comment.findOne({ _id: comment_id });

    if (!commentExists) {
        return res.status(400).json({
            message: "Comment_id doesn't exist"
        })
    }
    return res.status(200).json({
        _id: commentExists.id,
        text: commentExists.text,
        user_id: commentExists.user_id,
        map_id: commentExists.map_id,
        votes: commentExists.votes,
        usersVoted: commentExists.usersVoted
    })
})



module.exports = {
    postComment,
    getComment
}