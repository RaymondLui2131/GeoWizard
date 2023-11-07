//import React, { useState } from 'react'
//import { Link } from 'react-router-dom'
//import {authgetUser } from "../auth/auth_request_api"
//import {useGetUser} from "./UserContext" //updating user via Context jadenw2542@gmail.com
import Banner from './Banner.js'

const HomeScreen = () => {
    //const user = useGetUser()
    return(
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <Banner/> 
            <div className= 'text-5xl font-PyeongChangPeace-Light text-primary-GeoBlue' > Popular Maps </div>
        </div>
    );
}

export default HomeScreen