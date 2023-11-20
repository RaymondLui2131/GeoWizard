import axios from 'axios';


const isLocal = process.env.NODE_ENV === "development";
const host = isLocal ? "localhost" : window.location.hostname;
const port = isLocal ? 4000 : window.location.port;
const endpoint = "/comments/";
const baseURL = isLocal
    ? `http://${host}:${port}`
    : `${window.location.protocol}//${host}:${port}`;
const API_URL = `${baseURL}${endpoint}`;



export const changeLikesComment = async (user_id, comment_id, amount) => {
    try {
        const response = await axios.put(`${API_URL}changeLikesComment`, {
            user_id: user_id,
            comment_id: comment_id,
            amount:amount,
        })
        return response
    } catch (err) {
        return err.response
    }
}