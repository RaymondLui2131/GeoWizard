/**
 * Base code for creating the server
 * @author Kahui Wong
 */
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const userRoutes = require("../routes/user_routes")
const mapRoutes = require("../routes/map_routes")

const createServer = () => {
    require('dotenv').config();

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(cookieParser());

    app.use("/users", userRoutes);
    app.use("/maps", mapRoutes)
    if (process.env.NODE_ENV === 'production') {
        const buildPath = path.join(__dirname, "../../client/build");
        app.use(express.static(buildPath));

        app.get("/*", function (req, res) {
            res.sendFile(
                path.join(buildPath, "index.html"),
                function (err) {
                    if (err) {
                        res.status(500).send(err);
                    }
                }
            );
        });
    } else {
        console.log(`Running in ${process.env.NODE_ENV} mode`);
    }

    return app;
}

module.exports = createServer