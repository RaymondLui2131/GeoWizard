import axios from "axios"

const isLocal = process.env.NODE_ENV === "development"; 
const host = isLocal ? "localhost" : window.location.hostname;
const port = isLocal ? 4000 : window.location.port;
const endpoint = "/users/";
const baseURL = isLocal
  ? `http://${host}:${port}`
  : `${window.location.protocol}//${host}:${port}`;
const API_URL = `${baseURL}${endpoint}`;

export const authRegisterUser = async (email, username, password) => {
    try {
        return await axios.post(`${API_URL}register`, {
            email: email,
            username: username,
            password: password
        })
    } catch (err) {
        return err.response
    }
}

export const authloginUser = async (email, password) => {
    try {
        return await axios.post(`${API_URL}login`, {
            email: email,
            password: password
        })
    } catch (err) {
        return err.response
    }
}

export const authgetUser = async (token) => {
    try {
        return await axios.get(`${API_URL}me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (err) {
        return err.response
    }
}


export const authgetMaps = async (token) => {
    try {
        return await axios.get(`${API_URL}me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (err) {
        return err.response
    }
}
