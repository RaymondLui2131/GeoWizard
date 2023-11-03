/**
 * Base code for creating the server
 * @author Kahui Wong
 */
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const userRoutes = require("../routes/user_routes")
const createServer = () => {
    require('dotenv').config()

    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())
    app.use(cookieParser())
    app.use("/users", userRoutes)

    const _dirname = path.dirname("");
    const buildPath = path.join(_dirname, "../client/build");
    app.use(express.static(buildPath))
    app.get("/*", function (req, res) {
        res.sendFile(
            path.join(_dirname, "../client/build/index.html"),
            function (err) {
                if (err) {
                    res.status(500).send(err);
                }
            }
        )
    });


    return app
}

module.exports = createServer