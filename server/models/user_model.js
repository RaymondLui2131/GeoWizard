/**
 * Model for the user
 * @author Raymond Lui
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },

    maps: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Map'
        }],
        default: []
    },

    comments: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        default: []
    },

    number_maps_posted: {
        type: Number,
        default: 0
    },

    birthday: {
        type: Date,
        default: null
    },

    location: {
        type: String,
        default: ""
    },

    about: {
        type: String,
        default: ""
    },
    googleSignedIn: {
        type: Boolean,
        required: true,
        default: false
    },
    passwordResetUsed: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true // adds a timestamp for when the user is created
})

module.exports = mongoose.model('User', userSchema)