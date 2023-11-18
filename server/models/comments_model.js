const mongoose = require('mongoose')
const Schema = mongoose.Schema


const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },

    user_id: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    map_id: {
        type:Schema.Types.ObjectId,
        ref: 'Map',
        required: true
    },

    votes: {
        type:Number,
        default:0
    },

    usersVoted: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    }
},
    {
        timestamps: true // adds a timestamp for when the map_data is created
    })

module.exports = mongoose.model('Comment', commentSchema)