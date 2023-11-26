const asyncHandler = require('express-async-handler')
const User = require("../models/user_model")
const Comment = require("../models/comments_model")
const Map = require("../models/map_model")


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
        userExists.comments.push(newComment.id);
        await userExists.save();    
    }
    else {
        return res.status(404).json({ //404 not found
            message: "User not found"
        })
    }

    // adds comment into the Map's comments array
    const mapExists = await Map.findOne({ _id: map_id });

    if (mapExists) {
        mapExists.comments.push(newComment.id);
        await mapExists.save();    
    }
    else {
        return res.status(404).json({
            message: "Map not found"
        })
    }

    if (newComment) {
        await newComment.populate('user_id')
        console.log("serverNew".newComment)
        return res.status(200).json({newComment
            // _id: newComment.id,
            // text: newComment.text,
            // user_id: newComment.user_id,
            // map_id: newComment.map_id
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
        return res.status(404).json({
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


//PUT increments/decrement vote counter on comment
const changeLikesComment = asyncHandler(async (req, res) => {
    const { user_id, comment_id, amount} = req.body
    console.log('Changing likes',amount)
    var comment
    {
        if(amount > 0)
        comment = await Comment.findByIdAndUpdate(comment_id, {$inc:{ votes: amount }, $push: {usersVoted: user_id }}, { new: true } )
        else
        comment = await Comment.findByIdAndUpdate(comment_id, {$inc:{ votes: amount }, $pull: {usersVoted: user_id }} , { new: true } )
    }
    if (!comment) {
        return res.status(404).json({
            message: "Failed to find comment"
        })
    }
    return res.status(200).json({comment})
})

const getUserComments = asyncHandler(async (req, res) => {
    const { user_id } = req.body
    const response = await Comment.find({ user_id })
    if (!response) {
        return res.status(404).json({
            message: "Comment not found"
        })
    }

    return res.status(200).json(response)
})

module.exports = {
    postComment,
    getComment,
    changeLikesComment,
    getUserComments
}