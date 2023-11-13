
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

import React, { createContext, useContext, useState} from 'react'

const UserContext = createContext()
const UserLogInContext = createContext()
const UserLogOutContext = createContext()

export function useGetUser() {
    return useContext(UserContext)
}

export function useUserLogIn() {
    return useContext(UserLogInContext)
}

export function useUserLogOut() {
    return useContext(UserLogOutContext)
}

export function UserProvider({children}){
    const [user, setUser] = useState('guest')

    function LogInUser(newUser){
        console.log(newUser)
        setUser(newUser)
    }

    function LogOutUser(){
        setUser('guest')
    }


return (
    <UserContext.Provider value = {user}>
        <UserLogInContext.Provider value = {LogInUser}>
            <UserLogOutContext.Provider value = {LogOutUser}>
                {children}
            </UserLogOutContext.Provider>
        </UserLogInContext.Provider>
    </UserContext.Provider>
)

}