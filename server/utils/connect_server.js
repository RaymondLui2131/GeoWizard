const mongoose = require("mongoose")

const connectServer = async () => {
    const uri = process.env.URI
    await mongoose.connect(uri)
    const connection = mongoose.connection
    connection.once("open", () => { console.log("MongoDB database connection established successfully") })
}

module.exports = connectServer