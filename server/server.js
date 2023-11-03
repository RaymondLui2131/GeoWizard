/**
 * Base code for the user
 * @author Kahui Wong
 */
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')
const app = express()


const _dirname = path.dirname("")
const buildPath = path.join(_dirname, "../client/build");
app.use(express.static(buildPath))

app.get("/*", function (req, res) {
    res.sendFile(
        path.join(_dirname, "../client/build/index.html"),
        function (err){
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});


require('dotenv').config()

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

