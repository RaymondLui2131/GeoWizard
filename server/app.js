/**
 * Base code for running the server
 * @author Kahui Wong
 */
const port = process.env.PORT || 4000
const createServer = require("./utils/create_server")
const connectServer = require("./utils/connect_server")
const app = createServer()

app.listen(port, async () => {
    console.log(`Server is running on port: ${port}`)
    await connectServer()
})
