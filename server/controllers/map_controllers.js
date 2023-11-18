const asyncHandler = require('express-async-handler')
const Map = require("../models/map_model")
const MapData = require("../models/map_data_model")
const User = require("../models/user_model")
/**
 * find the corresponding user by the token
 * compress the geojson file using geobuf
 * create the map object and save the geobuf file to mapData
 * add the id of the map to the user's array
 * 
 */

/**
 *  user_id: user_id,
    title: title,
    isPublic: isPublic,
    mapType: mapType,
    description: description,
    mapData: mapData
 */
const saveUserMap = asyncHandler(async (req, res) => {
    const { user_id, title, isPublic, mapType, description, mapData } = req.body
    const map_id = await createMap(req, res)
    if (!map_id) {
        return res.status(400).json({
            message: "Save user map failed"
        })
    }

    // find user by id
    const user = await User.findById(user_id)
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    // add the map_id to user.maps
    user.maps.push(map_id)
    await user.save()

    return res.status(200).json({
        user_id: user_id,
        map_id: map_id
    })
})

const createMap = asyncHandler(async (req, res) => { // used within saveUserMap
    const { user_id, title, isPublic, mapType, description, mapData } = req.body
    if (!(title && user_id && mapData)) {
        return res.status(400).json({
            message: "Missing required fields for map creation"
        })
    }

    const map_data = await MapData.create({ // create the map data and store it in the database
        original_map: mapData,
        edits: []
    })

    const map = await Map.create({ // create the map and add the reference to the corresponding map data
        user_id: user_id,
        title: title,
        isPublic: isPublic,
        mapType: mapType,
        description: description,
        MapData: map_data._id,
    })

    if (!map) {
        return res.status(400).json({
            message: "Map creation failed"
        })
    }

    return map._id // return only the id so it can be stored by the user
})

//Expects a mapID and returns the Map data 
//GET
const getMap = asyncHandler(async (req, res) => {
    const mapID = req.query.mapID;
    console.log(mapID)
    const map = await Map.findById(mapID)
    if (!map) {
        return res.status(400).json({
            message: "Could not find map"
        })
    }
    const mapWithUser = await map.populate('user_id')
    if (!mapWithUser) {
        return res.status(400).json({
            message: "Could not find user"
        })
    }
    const mapWithData = await mapWithUser.populate('MapData')
    console.log(mapWithData)
    if (!mapWithData) {
        return res.status(400).json({
            message: "Could not find map data"
        })
    }

    return res.json(mapWithData)

})



module.exports = {
    saveUserMap,
    createMap,
    getMap
}