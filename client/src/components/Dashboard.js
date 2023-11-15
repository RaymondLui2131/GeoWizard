/**
 * should look the same as homepage except that it only displays maps made by the user
 * user can click on "Home" to view maps from the community
 * 
 * use test123@gmail.com and abc123 to test login
 */
import React, { useContext } from 'react'
import { UserContext } from '../auth/UserContext'
const Dashboard = () => {
  const { user } = useContext(UserContext)
  return (
    <div>{user && `Token: ${user.token}`}</div>
  )
}

export default Dashboard