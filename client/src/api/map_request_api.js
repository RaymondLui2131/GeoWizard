import axios from "axios"

const isLocal = process.env.NODE_ENV === "development";
const host = isLocal ? "localhost" : window.location.hostname;
const port = isLocal ? 4000 : window.location.port;
const endpoint = "/maps";
const baseURL = isLocal
    ? `http://${host}:${port}`
    : `${window.location.protocol}//${host}:${port}`;
const API_URL = `${baseURL}${endpoint}`;


export const saveUserMap = async (user, map) => {
    try {
        return await axios.put(`${API_URL}save`, {
            user: user,
            map: map
        })
    } catch (err) {
        return err.response
    }
}