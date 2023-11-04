import axios from "axios"

const API_URL = "/users/"

const authRegisterUser = async (email, username, password) => {
    try {
        const res = await axios.post(`${API_URL}register`, {
            email: email,
            username: username,
            password: password
        })

        return res.data
    } catch (err) {
        return err.response
    }
}

const authloginUser = async (email, password) => {
    try {
        const res = await axios.post(`${API_URL}login`, {
            email: email,
            password: password
        })

        return res.data
    } catch (err) {
        return err.response
    }
}

const authgetUser = async (token) => {
    try {
        const res = await axios.get(`${API_URL}me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    } catch (err) {
        return err.response
    }
}

module.exports = {
    authRegisterUser, authloginUser, authgetUser
}