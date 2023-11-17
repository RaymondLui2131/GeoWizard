const asyncHandler = require('express-async-handler')
const Map = require("../models/map_model")
/**
 * find the corresponding user by the token
 * compress the geojson file using geobuf
 * create the map object and save the geobuf file to mapData
 * add the id of the map to the user's array
 * 
 */
const saveUserMap = asyncHandler(async (req, res) => {
    const response = createMap(req.body)
    const { user_id } = req.body
    if (response.status == 400) {
        return res.status(400).json({
            message: "Save user map failed"
        })
    }

    // find user by id and add the map_id to user.maps
    return res.status(200).json({
        message: "Save user map successful"
    })
})

const createMap = asyncHandler(async (req, res) => { // used within saveUserMap
    const { user_id, title, isPublic, mapType, description, mapData } = req.body
    if (!(title && user_id && mapData)) {
        return res.status(200).json({
            message: "Missing required fields for map creation"
        })
    }

    const map = Map.create({
        title: title,
        user_id: user_id,
        mapData: mapData,
        isPublic: isPublic,
        mapType: mapType,
        description: description
    })

    if (!map) {
        return res.status(200).json({
            message: "Map creation failed"
        })
    }

    return res.status(400).json({
        _id: map._id
    })
})

module.exports = {
    saveUserMap
}