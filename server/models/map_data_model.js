/*
    Information about the map and the edits
    The originaldata is encoded as a buffer, needs to be translated to Uint8Array(8)
    and then decoded for use

    The edits stores array of json edits. Schema.Types.Mixed definition is dependent on the map type
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mapDataSchema = new Schema({
    original_map: {
        type: Object,
        required: true
    },

    /*
        Will follow format of
        header: contains the header info //refer to client/editMapDataStructures
        editsList: contains list of edits
    */
    edits: {
        type: Object,
        default:{}
    },

},
    {
        timestamps: true // adds a timestamp for when the map_data is created
    })

module.exports = mongoose.model('MapData', mapDataSchema)