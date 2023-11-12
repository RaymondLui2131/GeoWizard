import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authloginUser, authgetUser } from "../auth/auth_request_api"
const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [token, setToken] = useState("")
  const [res, setRes] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setRes(null)
    const response = await authloginUser(formData.email, formData.password)
    if (response) {
      setRes(response.data)
    }
  }

  const handleTokenChange = (e) => {
    const value = e.target.value
    setToken(value)
  }

  const handleUser = async (e) => {
    e.preventDefault()
    setRes(null)
    const response = await authgetUser(token)
    if (response) {
      setRes(response.data)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder='Email' value={formData.email} onChange={handleInputChange} />
        <input type="text" name="password" placeholder='Password' value={formData.password} onChange={handleInputChange} />
        <button type='submit' data-test-id="login-button">Submit</button>

      </form>
      <form onSubmit={handleUser}>
        <input type="text" name="token" placeholder='Enter Token' value={token} onChange={handleTokenChange} />
        <button type='submit' data-test-id="user-button">Login</button>
      </form>
      <Link to="/register">Register</Link>
      {res && (
        <pre>
          {JSON.stringify(res, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default LoginScreen