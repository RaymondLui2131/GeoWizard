import axios from "axios"
import geobuf_api from "./geobuf_api";

const isLocal = process.env.NODE_ENV === "development";
const host = isLocal ? "localhost" : window.location.hostname;
const port = isLocal ? 4000 : window.location.port;
const endpoint = "/maps/";
const baseURL = isLocal
    ? `http://${host}:${port}`
    : `${window.location.protocol}//${host}:${port}`;
const API_URL = `${baseURL}${endpoint}`;


export const saveUserMap = async (token, title, isPublic, mapType, description, mapData) => {
    try {
        const compressedMapData = geobuf_api.geojson_compress(mapData)
        const response = await axios.put(`${API_URL}save`, {
            title: title,
            isPublic: isPublic,
            mapType: mapType,
            description: description,
            mapData: compressedMapData
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (err) {
        return err.response
    }
}

export const getMap = async (mapID) => {
    try {
        const response = await axios.get(`${API_URL}getMap`, {
            params: {
                mapID: mapID
            }
        })
        //console.log('getMap', mapID)
        const data = response.data
        const decompressedMapData = geobuf_api.geojson_decompress(data.MapData.original_map)
        //console.log(decompressedMapData)
        // console.log(data.MapData.original_map)
        data.MapData.original_map = decompressedMapData
        //console.log(data)
        return data
    } catch (err) {
        return err.response
    }
}

//changesthe like counter for a map
export const changeLikesMap = async (user_id, map_id, amount, isNeutral) => {
    try {
        const response = await axios.put(`${API_URL}changeLikesMap`, {
            user_id: user_id,
            map_id: map_id,
            amount: amount,
            isNeutral: isNeutral
        })
        return response
    } catch (err) {
        return err.response
    }
}

