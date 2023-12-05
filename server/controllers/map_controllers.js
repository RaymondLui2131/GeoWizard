const asyncHandler = require('express-async-handler')
const Map = require("../models/map_model")
const MapData = require("../models/map_data_model")
const User = require("../models/user_model")

const getMapById = asyncHandler(async (req, res) => {
    const id = req.params.id

    // check if username exists in the database
    const map = await Map.findById(id).populate('user_id', 'username')

    if (!map) {
        return res.status(404).json({
            message: "Map not found"
        })
    }

    return res.status(200).json({
        map, username: map.user_id.username
    })
})

const saveUserMap = asyncHandler(async (req, res) => {
    const user = req.user // GET THE USER FROM JWT_MIDDLEWARE IF TOKEN VERIFICATION IS SUCCESSFUL
    // console.log(user)

    if (!user) {
        return res.status(401).json({
            message: "User is not authenticated"
        });
    }

    const createOrSave = req.body.createOrSave
    let map_id
    if (createOrSave === 'create') {
        map_id = await createMap(req, user)
        if (map_id.error) {
            return res.status(400).json({
                message: map_id.message
            })

        }

        user.maps.push(map_id)
        await user.save()
    }

    else {
        map_id = await updateMap(req, user)
        if (map_id.error) {
            return res.status(400).json({
                message: map_id.message
            })

        }

        await user.save()
    }

    // add the map_id to user.maps

    return res.status(200).json({
        user_id: user._id,
        map_id: map_id
    })
})

const getUserMaps = asyncHandler(async (req, res) => {
    const { userData } = req.body
    const mapIds = userData.maps
    const maps = await Map.find({ _id: { $in: mapIds } })
    if (maps) {
        return res.status(200).json(maps)
    } else {
        return res.status(500).json({
            message: "getUserMaps failed"
        })
    }
})

const createMap = async (req, user) => { // used within saveUserMap
    const { title, isPublic, mapType, description, mapInfo, createOrSave, idToUpdate } = req.body
    if (!user) {
        return {
            error: true,
            message: "User is not authenticated"
        }
    }

    if (!(title && mapInfo)) {
        return {
            error: true,
            message: "Missing required fields for map creation"
        }
    }
    const map_data = await MapData.create({ // create the map data and store it in the database
        original_map: mapInfo.original_map,
        edits: mapInfo.edits
    })

    if (!map_data) {
        return { //Internal Server Error
            error: true,
            message: "Map Data creation failed"
        }
    }

    const map = await Map.create({ // create the map and add the reference to the corresponding map data
        user_id: user._id,
        title: title,
        isPublic: isPublic,
        mapType: mapType,
        description: description,
        MapData: map_data._id,
    })

    if (!map) {
        return { //Internal Server Error
            error: true,
            message: "Map creation failed"
        }
    }

    return map._id // return only the id so it can be stored by the user
}

const updateMap = async (req, user) => {
    const { title, isPublic, mapType, description, mapInfo, createOrSave, idToUpdate } = req.body
    if (!user) {
        return {
            error: true,
            message: "User is not authenticated"
        }
    }

    if (!(title && mapInfo)) {
        return {
            error: true,
            message: "Missing required fields for map creation"
        }
    }

    const map = await Map.findById(idToUpdate)
    if (!map) {
        return {
            error: true,
            message: "Map not found"
        }
    }

    map.title = title
    map.isPublic = isPublic
    map.mapType = mapType
    map.description = description

    const map_data = await MapData.findById(map.MapData)
    if (!map_data) {
        return {
            error: true,
            message: "MapData not found"
        }
    }
    map_data.original_map = mapInfo.original_map
    map_data.edits = mapInfo.edits

    await map_data.save()
    await map.save()

    return map._id
}

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

    return res.json(mapWithDetails);
})


//Expects a mapID and userId, increments 
//Put
const changeLikesMap = asyncHandler(async (req, res) => {
    const { user_id, map_id, amount, isNeutral } = req.body
    console.log('Changing likes', amount)
    var map
    if (isNeutral)//Resetting back 
    {
        if (amount > 0)
            map = await Map.findByIdAndUpdate(map_id, { $inc: { likes: amount }, $pull: { userDislikes: user_id } }, { new: true })
        else
            map = await Map.findByIdAndUpdate(map_id, { $inc: { likes: amount }, $pull: { userLikes: user_id } }, { new: true })
    }
    else {
        if (amount > 0)
            map = await Map.findByIdAndUpdate(map_id, { $inc: { likes: amount }, $push: { userLikes: user_id }, $pull: { userDislikes: user_id } }, { new: true })
        else
            map = await Map.findByIdAndUpdate(map_id, { $inc: { likes: amount }, $push: { userDislikes: user_id }, $pull: { userLikes: user_id } }, { new: true })
    }

    if (!map) {
        return res.status(404).json({
            message: "Failed to find map"
        })
    }
    return res.status(200).json({ map })


})


//Gets Maps that are public
//GET
// query should contain what they searched, and time/sort vars
const queryMaps = asyncHandler(async (req, res) => {
    console.log('req', req.query)
    const { q, page } = req.query
    const { query, metric, time } = q
    const pageSize = 3;
    const skip = pageSize * (page - 1);

    console.log(q, page)

    let mock = null

    if (req.query.mock) {
        mock = true
    }


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
    if (metric != '') {
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
    console.log(queryObj)
    console.log(sortObj)


    if (mock) {
        const publicMaps = await Map.find(queryObj)
        if (!publicMaps) {
            return res.status(404).json({ // 404 Not Found
                message: "Could not find map data"
            })
        }
        return res.status(200).json(publicMaps)
    }

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
        return res.status(404).json({ // 404 Not Found
            message: "Could not find map data"
        })
    }
    return res.status(200).json(publicMaps)
})

module.exports = {
    saveUserMap,
    createMap,
    getMap,
    queryMaps,
    changeLikesMap,
    getUserMaps,
    getMapById
}

