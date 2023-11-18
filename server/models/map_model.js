/**
 * for displaying map information on cards (map title, description, etc),
 * fetch only the relevant info
 * only load the map data / graphical data when editing 
 */


// Basic geojson format:
// {
//     "type": "Feature",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [125.6, 10.1]
//     },
//     "properties": {
//       "name": "Dinagat Islands"
//     }
//   }
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mapSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    likes: {
        type: Number,
        default: 0
    },

    dislikes: {
        type: Number,
        default: 0
    },

    views: {
        type: Number,
        default: 0
    },

    comments: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        default: []
    },

    isPublic: {
        type: Boolean,
        default: false
    },

    mapType: {
        type: String,
        enum: ['NONE', // NONE means basic geojson file with no stylings
            'HEATMAP',
            'POINT',
            'SYMBOL',
            'CHOROPLETH',
            'FLOW'],
        default: 'NONE'
    },

    MapData: { // stores the geojson map data in either binary encoded form (geobuf) or the geojson object type specified by MongoDb docs
        type: Schema.Types.ObjectId,
        ref: 'MapData',
        required: true
    },
},

    {
        timestamps: true // adds a timestamp for when the map is created
    })

module.exports = mongoose.model('Map', mapSchema)