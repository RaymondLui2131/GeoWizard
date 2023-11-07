import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { authRegisterUser } from "../auth/auth_request_api"
const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password1: "",
    password2: ""
  })

  const [message, setMessage] = useState("")
  const [res, setRes] = useState(null)

  let navigate = useNavigate(); //used to redirect to another page

  const handleInputChange = (e) => {

    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setRes(null)
    if (formData.password1 !== formData.password2) {
      setMessage("Passwords don't match")
      return
    }

    const response = await authRegisterUser(formData.email, formData.username, formData.password1)
    if (response) {
      setRes(response.data)
      navigate("/login")
    } else {
      setMessage("Registration failed")
    }
  }


  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder='Email' value={formData.email} onChange={handleInputChange} />
        <input type="text" name="username" placeholder='Username' value={formData.username} onChange={handleInputChange} />
        <input type="text" name="password1" placeholder='Password' value={formData.password1} onChange={handleInputChange} />
        <input type="text" name="password2" placeholder='Confirm Password' value={formData.password2} onChange={handleInputChange} />
        <button type='submit'>Confirm</button>
      </form>
      {message && <p>{message}</p>}
      {res && (
        <pre>
          {JSON.stringify(res, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default RegisterScreen