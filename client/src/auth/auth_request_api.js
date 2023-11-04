import axios from "axios"

const API_URL = "http://localhost:4000/users/" // change this later

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
