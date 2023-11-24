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

//Expects a mapID and returns the Map data  with MapData field that has geojson
//GET
const getMap = asyncHandler(async (req, res) => {
    const mapID = req.query.mapID;
    console.log('getMap', mapID)
    const mapWithDetails = await Map.findById(mapID)
        .populate({
            path: 'user_id',
            select: '_id username' 
        })
        .populate({
            path: 'MapData',
            select: 'original_map edits' 
        })
        .populate({
            path: 'comments',
            select: '_id text user_id votes usersVoted createdAt', 
            populate: [
                {
                    path: 'user_id',
                    model: 'User',
                    select: '_id username'
                }
            ]
        })
        
    if (!mapWithDetails) {
        return res.status(404).json({ message: "Could not find map or related data" });
    }
    console.log(mapWithDetails)

    return res.json(mapWithDetails);
})


//Expects a mapID and userId, increments 
//Put
const changeLikesMap = asyncHandler(async (req, res) => {
    const { user_id, map_id, amount, isNeutral } = req.body
    console.log('Changing likes',amount)
    var map
    if(isNeutral)//Resetting back 
    {
        if(amount > 0)
            map = await Map.findByIdAndUpdate(map_id, {$inc:{ likes: amount }, $pull: {userDislikes: user_id }}, { new: true } )
        else
            map = await Map.findByIdAndUpdate(map_id, {$inc:{ likes: amount }, $pull:{userLikes: user_id } }, { new: true } )
    }
    else
    {
        if(amount > 0)
            map = await Map.findByIdAndUpdate(map_id, {$inc:{ likes: amount }, $push: {userLikes: user_id } ,$pull: {userDislikes: user_id}} , { new: true } )
        else
            map = await Map.findByIdAndUpdate(map_id, {$inc:{ likes: amount }, $push: {userDislikes: user_id } ,$pull: {userLikes: user_id}} , { new: true } )
    }

    if (!map) {
        return res.status(404).json({
            message: "Failed to find map"
        })
    }
    return res.status(200).json({map})


})


//Gets Maps that are public
//GET
// query should contain what they searched, and time/sort vars
const queryMaps = asyncHandler(async (req, res) => {
    console.log('req', req.query)
    const {q, page} = req.query
    const{query, metric, time} = q
    const pageSize = 3;
    const skip = pageSize * (page - 1);

    let queryObj = { isPublic: true };
    if (query) {    
        queryObj.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ];
    }

    if (time != '') {
        const now = new Date();
        let startDate;

        switch (time) {
            case 'Today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'This Week':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                break;
            case 'This Month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'This Year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case 'All The Time':
                startDate = new Date(0);  // The Unix Epoch
                break;
        }
        if (startDate) {
            queryObj.createdAt = { $gte: startDate };
        }
    }
    
    let sortObj = {};
    if(metric != ''){
        switch (metric) {
            case 'Recents':
                sortObj = { createdAt: -1 }; // Sort by most recent first
                break;
            case 'Oldest':
                sortObj = { createdAt: 1 }; // Sort by oldest first
                break;
            case 'Most Comments':
                sortObj = { comments: -1 }; // Sort by number of comments, descending
                break;
            case 'Most Likes':
                sortObj = { likes: -1 }; // Sort by number of likes, descending
                break;
            case 'Most Views':
                sortObj = { views: -1 }; // Sort by number of views, descending
                break;
        }
    }

    //console.log(sortObj)
    const publicMaps = await Map.find(queryObj)
            .sort(sortObj)
            .skip(skip)
            .limit(pageSize)
            .populate({
                path: 'user_id',
                select: '_id username' 
            })
            .populate({
                path: 'MapData',
                select: 'original_map edits' 
            })
            .populate({
                path: 'comments',
                select: '_id text user_id votes usersVoted createdAt', 
                populate: [
                    {
                        path: 'user_id',
                        model: 'User',
                        select: '_id username'
                    }
                ]
            })


        
    //console.log(publicMaps)
    if (!publicMaps) {
        return res.status(400).json({
            message: "Could not find map data"
        })
    }
    return res.json(publicMaps)
})

module.exports = {
    saveUserMap,
    createMap,
    getMap,
    queryMaps,
    changeLikesMap
}