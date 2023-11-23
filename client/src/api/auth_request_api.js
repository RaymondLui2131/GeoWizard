import axios from "axios"

const isLocal = process.env.NODE_ENV === "development";
const host = isLocal ? "localhost" : window.location.hostname;
const port = isLocal ? 4000 : window.location.port;
const endpoint = "/users/";
const baseURL = isLocal
    ? `http://${host}:${port}`
    : `${window.location.protocol}//${host}:${port}`;
const API_URL = `${baseURL}${endpoint}`;
const GOOGLE_URL = "https://www.googleapis.com/oauth2/v1/userinfo?access_token="

export const googleLoginUser = async (googleUser) => {
    try {
        const response = await axios.get(`${GOOGLE_URL}${googleUser.access_token}`, {
            headers: {
                Authorization: `Bearer ${googleUser.access_token}`,
                Accept: 'application/json'
            }
        })
        
        if (response) {
            const {email, name, id} = response.data
            return await axios.post(`${API_URL}google/login`, {
                email: email,
                username: name,
                googleId: id
            })
        }
    } catch (err) {
        return err.response
    }
}


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
        const response = await axios.get(`${API_URL}me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
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

export const postUser = async (userData) => {
    let link;
    if (process.env.NODE_ENV == 'development'){
        link = 'http://localhost:4000/users/register'
    }
    else if (process.env.NODE_ENV == 'production'){
        link = 'https://geowizard-app-b802ae01ce7f.herokuapp.com/users/register'
    }
    try {
        const response = await axios.post(link, userData);
        return response
    } catch (err) {
        console.log('link: %s', link);
        return err.response
    }
}

export const checkEmail = async (email) => {
    let apiBaseUrl = process.env.NODE_ENV
    if (apiBaseUrl === 'development'){
        apiBaseUrl = "http://localhost:4000"
    }
    else if (apiBaseUrl === 'production'){
        apiBaseUrl = "https://geowizard-app-b802ae01ce7f.herokuapp.com"
    }
    else {
        console.log("NODE_ENV ERROR")
        return
    }
    try {
        const response = await axios.get(`${apiBaseUrl}/users/checkUniqueEmail`, {
            params: { email }
        });
        return response;
    } catch (err) {
        console.error('Error finding an email:', err);
        return err.response;
    }
}

export const checkUser = async (username) => {
    let apiBaseUrl = process.env.NODE_ENV
    if (apiBaseUrl === 'development'){
        apiBaseUrl = "http://localhost:4000"
    }
    else if (apiBaseUrl === 'production'){
        apiBaseUrl = "https://geowizard-app-b802ae01ce7f.herokuapp.com"
    }
    else {
        console.log("NODE_ENV ERROR")
        return
    }
    try {
        const response = await axios.get(`${apiBaseUrl}/users/checkUniqueUser`, {
            params: { username }
        });
        return response;
    } catch (err) {
        console.error('Error finding an username:', err);
        return err.response;
    }
}

const api = {
    authRegisterUser,
    authgetUser,
    authloginUser,
    authgetMaps,
    googleLoginUser,
    postUser,
    checkEmail, 
    checkUser
}

export default api