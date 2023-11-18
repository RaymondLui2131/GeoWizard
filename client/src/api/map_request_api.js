import axios from "axios"

const isLocal = process.env.NODE_ENV === "development";
const host = isLocal ? "localhost" : window.location.hostname;
const port = isLocal ? 4000 : window.location.port;
const endpoint = "/maps/";
const baseURL = isLocal
    ? `http://${host}:${port}`
    : `${window.location.protocol}//${host}:${port}`;
const API_URL = `${baseURL}${endpoint}`;


export const saveUserMap = async (user_id, title, isPublic, mapType, description, mapData) => {
    try {
        const response = await axios.put(`${API_URL}save`, {
            user_id: user_id,
            title: title,
            isPublic: isPublic,
            mapType: mapType,
            description: description,
            mapData: mapData
        })

        return response
    } catch (err) {
        return err.response
    }
}