
/**
 * User Context for handing user state variable, which holds the data of the user that is currently logged in.
 * It's default value use 'guest' which means the user is using the application as a guest
 * When a user is logged out, they should automatically be directed to the home page
 * 
 * To use inside a component: 
 * import {useGetUser, useUserLogIn, useUserLogOut} from "./UserContext"
 * 
 * Example Usage: 
 * const user = useGetUser()
 * const logInUser = useUserLogIn()
 * 
 * @author Jaden Wong
 */

import React, { createContext, useReducer, useMemo, useEffect } from 'react'
import Cookies from "js-cookie"
import { authgetUser } from './auth_request_api'
/**
 * to use:
 * import { UserContext, UserActionType } from "../auth/UserContext.js"
 * const { user, errorMessage, dispatch } = useContext(UserContext)
 * call dispatch using one of the provided action type and the response returned by the axios request functions
 * this way, state transitions are predictable and simplifies unit testing
 */
export const UserContext = createContext()

/**
 * represents the actions that can be processed by the use state
 */
export const UserActionType = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    ERROR: "ERROR"
}

/**
 * 
 * @param {*} state current state of the userContext
 * @param {*} action action dispatched to update the userContext state, including type and payload
 * @returns the new state of userContext after the update
 */
export const authReducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case UserActionType.LOGIN: {
            Cookies.set("token", payload.token, { expires: 7, secure: true, sameSite: 'strict' })
            return { ...state, user: payload }
        }
        case UserActionType.LOGOUT: {
            Cookies.remove("token")
            return { ...state, user: null }
        }

        case UserActionType.ERROR: {
            return { ...state, errorMessage: payload }
        }
        default:
            return state
    }
}

/**
 * 
 * @param {*} param0 
 * @returns userContext wrapper 
 */
export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null, // null means the user is a guest
        errorMessage: null
    })

    console.log("User State: " + state)

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get("token") // check if token is stored in the cookies
            if (token) {
                try {
                    const user1 = await authgetUser(token) // get user by token
                    const user_data = {
                        _id: user1._id,
                        username: user1.username,
                        email: user1.email,
                        token: token
                    }
                    dispatch({ type: UserActionType.LOGIN, payload: user_data })
                } catch (error) {
                    console.log(error)
                }
            }
        }

        fetchUser()
    }, [])

    const contextValue = useMemo(() => ({ ...state, dispatch }), [state, dispatch])
    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}