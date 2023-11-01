/**
 * Base code for the user
 * @author Kahui Wong
 */
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

const uri = process.env.URI
mongoose.connect(uri)
const connection = mongoose.connection
connection.once("open", () => { console.log("MongoDB database connection established successfully") })

app.use("/users", require("./routes/user_routes"))

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})