const User = require("../models/user_model")
const { signToken } = require("../jwt_middleware")

const bcrypt = require("bcryptjs")
const UserController = require("../controllers/user_controllers")
const user_data1 = {
    id: "123",
    username: "testuser",
    email: "test123@gmail.com",
}

const user_data2 = {
    email: "bob123@gmail.com",
    password: "abc123"
}

jest.mock("../models/user_model", () => ({
    findOne: jest.fn()
}));

jest.mock("bcryptjs", () => ({
    compare: jest.fn()
}));

jest.mock("../jwt_middleware", () => ({
    signToken: jest.fn()
}));

const mockRequest = (body) => ({
    body
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("testing login user", () => {
    it("should successfully login the user", async () => {
        const req = mockRequest({
            email: "test123@gmail.com",
            password: "abc123"
        });

        const res = mockResponse();

        User.findOne.mockResolvedValue(user_data1); // returns user_data1
        bcrypt.compare.mockResolvedValue(true); // returns true for bcrypt.compare
        signToken.mockReturnValue("token_123");  // returns mocked token value

        await UserController.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith( // expected return value
            {
                _id: "123",
                username: "testuser",
                email: "test123@gmail.com",
                token: "token_123"
            }
        );
    });
});


// describe("testing POST users/register", () => {
//     beforeAll(async () => {
//         const testServer = await MongoMemoryServer.create()
//         await mongoose.connect(testServer.getUri())
//     })

//     afterAll(async () => {
//         await mongoose.disconnect()
//         await mongoose.connection.close()
//     })

//     it("should successfully create a user", async () => {
//         const response = await supertest(app)
//             .post("/users/register")
//             .send(user_data1)
//             .set("Content-type", "application/json")
//         expect(response.status).toBe(200)
//         expect(response.body).toEqual({
//             _id: expect.any(String),
//             username: "testuser",
//             email: "test123@gmail.com",
//             token: signToken(response.body._id)
//         })

//         const registered_user = await User.findOne({ email: user_data1.email })
//         expect(registered_user).toBeTruthy()
//     })

//     it("should fail if user already exists", async () => {
//         const response = await supertest(app)
//             .post("/users/register")
//             .send(user_data1)
//             .set("Content-type", "application/json")
//         expect(response.status).toBe(409)
//         expect(response.body).toEqual({
//             message: "Email already exists"
//         })
//     })

//     it("should fail if missing required fields", async () => {
//         const response = await supertest(app)
//             .post("/users/register")
//             .send(user_data2)
//             .set("Content-type", "application/json")
//         expect(response.status).toBe(400)
//         expect(response.body).toEqual({
//             message: "Missing required fields for register"
//         })
//     })
// })

// describe("testing GET users/me", () => {
//     beforeAll(async () => {
//         const testServer = await MongoMemoryServer.create()
//         await mongoose.connect(testServer.getUri())
//     })

//     afterAll(async () => {
//         await mongoose.disconnect()
//         await mongoose.connection.close()
//     })

//     it("should return the user with the correct token", async () => {
//         const user = await User.create({
//             email: 'test@example.com',
//             username: 'testuser',
//             password: 'abc123',
//         })

//         const token = signToken(user._id)
//         const response = await supertest(app)
//             .get("/users/me")
//             .set("Authorization", `Bearer ${token}`)
//         expect(response.status).toBe(200)
//     })

//     it("should fail the user with incorrect token", async () => {
//         const token = "123"
//         const response = await supertest(app)
//             .get("/users/me")
//             .set("Authorization", `Bearer ${token}`)
//         expect(response.status).toBe(401)
//         expect(response.body).toEqual({
//             message: "Not authorized, token failed"
//         })
//     })

//     it("should fail the user without a token", async () => {
//         const response = await supertest(app)
//             .get("/users/me")
//             .set("Authorization", "Bearer ")
//         expect(response.status).toBe(401)
//         expect(response.body).toEqual({
//             message: "Not authorized, token failed"
//         })
//     })
// })


// describe("test POST users/login", () => {
//     beforeAll(async () => {
//         const testServer = await MongoMemoryServer.create()
//         await mongoose.connect(testServer.getUri())
//     })

//     afterAll(async () => {
//         await mongoose.disconnect()
//         await mongoose.connection.close()
//     })

//     it("should successfully login a user", async () => {
//         const registerUserResponse = await supertest(app)
//             .post("/users/register")
//             .send(user_data1)
//             .set("Content-type", "application/json")

//         expect(registerUserResponse.status).toBe(200)

//         const response = await supertest(app)
//             .post("/users/login")
//             .send({ email: "test123@gmail.com", password: "abc123" })
//             .set("Content-type", "application/json")
//         expect(response.status).toBe(200)
//         expect(response.body).toEqual({
//             _id: expect.any(String),
//             username: "testuser",
//             email: "test123@gmail.com",
//             token: signToken(response.body._id)
//         })
//     })

//     it("should fail if missing required fields", async () => {
//         const response = await supertest(app)
//             .post("/users/login")
//             .send({ email: "test@example.com" })
//             .set("Content-type", "application/json")
//         expect(response.status).toBe(400)
//         expect(response.body).toEqual({
//             message: "Missing required fields for login"
//         })
//     })

//     it("should fail if invalid credentials", async () => {
//         const response = await supertest(app)
//             .post("/users/login")
//             .send({ email: "test123@gmail.com", password: "wrongpass" })
//             .set("Content-type", "application/json")
//         expect(response.status).toBe(401)
//         expect(response.body).toEqual({
//             message: "Invalid credentials"
//         })
//     })
// })

// describe("testing Maps creation and get", () => {
//     let creatingUser
//     beforeAll(async () => {
//         const testServer = await MongoMemoryServer.create()
//         await mongoose.connect(testServer.getUri())
//             creatingUser = await supertest(app)
//             .post("/users/register")
//             .send(user_data1)
//             .set("Content-type", "application/json")
//     })

//     afterAll(async () => {
//         await mongoose.disconnect()
//         await mongoose.connection.close()
//     })

//     it("should successfully create a map", async () => {
//         const user_id = creatingUser.body._id
//         const newMap = {user_id: user_id,
//             title: "test title",
//             isPublic: true,
//             mapType: "NONE",
//             description: "testing",
//             mapData: Buffer.alloc(1024)
//         }//MapData is irrelevant
//         const mapCreationResponse = await supertest(app)
//             .put("/maps/save")
//             .send(newMap)
//             .set("Content-type", "application/json")
//         expect(mapCreationResponse.status).toBe(200)

//     })
//     it("should be able to get the map", async () => {
//         const user_id = creatingUser.body._id
//         const newMap = {user_id: user_id,
//             title: "test title",
//             isPublic: true,
//             mapType: "NONE",
//             description: "testing",
//             mapData: Buffer.alloc(1024)
//         }//MapData is irrelevant
//         const mapCreationResponse = await supertest(app)
//             .put("/maps/save")
//             .send(newMap)
//             .set("Content-type", "application/json")
//         const mapID = mapCreationResponse.body.map_id
//         const mapGet = await supertest(app)
//             .get("/maps/getMap")
//             .query({ mapID: mapID})
//             .set("Content-type", "application/json")
//         expect(mapGet.status).toBe(200)
//     })
// })

// describe("testing Maps Likes", () => {
//     let user_id
//     let mapID
//     beforeAll(async () => {
//         const testServer = await MongoMemoryServer.create()
//         await mongoose.connect(testServer.getUri())
//         creatingUser = await supertest(app)
//         .post("/users/register")
//         .send(user_data1)
//         .set("Content-type", "application/json")
//         user_id = creatingUser.body._id
//         const newMap = {user_id: user_id,
//             title: "test title",
//             isPublic: true,
//             mapType: "NONE",
//             description: "testing",
//             mapData: Buffer.alloc(1024)
//         }//MapData is irrelevant
//         const mapCreationResponse = await supertest(app)
//             .put("/maps/save")
//             .send(newMap)
//             .set("Content-type", "application/json")
//         mapID = mapCreationResponse.body.map_id
//     })
//     afterAll(async () => {
//         await mongoose.disconnect()
//         await mongoose.connection.close()
//     })

//     it("should be able to increment likes by 1", async () => {
//         const likeReq = {
//             user_id: user_id,
//             map_id: mapID,
//             amount: 1,
//             isNeutral: false
//         }
//         const likeResponse = await supertest(app)
//         .put("/maps/changeLikesMap")
//         .send(likeReq)
//         .set("Content-type", "application/json")
//         expect(likeResponse.status).toBe(200)
//         expect(likeResponse.body.map.likes).toBe(1)
//         expect(likeResponse.body.map.userLikes.length).toBe(1)
//         expect(likeResponse.body.map.userDislikes.length).toBe(0)

//     })
//     it("should be able to decrement likes by 1", async () => {
//         const likeReq = {
//             user_id: user_id,
//             map_id: mapID,
//             amount: -1,
//             isNeutral: false
//         }
//         const likeResponse = await supertest(app)
//         .put("/maps/changeLikesMap")
//         .send(likeReq)
//         .set("Content-type", "application/json")
//         console.log(likeResponse.body.map)
//         expect(likeResponse.status).toBe(200)
//         expect(likeResponse.body.map.likes).toBe(0)
//         expect(likeResponse.body.map.userLikes.length).toBe(0)
//         expect(likeResponse.body.map.userDislikes.length).toBe(1)
//     })
// })

// describe("test POST /comments/addComment", () => {
//     let user_id
//     let mapID

//     beforeAll(async () => {
//         const testServer = await MongoMemoryServer.create()
//         await mongoose.connect(testServer.getUri())
//         creatingUser = await supertest(app)
//         .post("/users/register")
//         .send(user_data1)
//         .set("Content-type", "application/json")
//         user_id = creatingUser.body._id
//         const newMap = {user_id: user_id,
//             title: "test title",
//             isPublic: true,
//             mapType: "NONE",
//             description: "testing",
//             mapData: Buffer.alloc(1024)
//         }//MapData is irrelevant
//         const mapCreationResponse = await supertest(app)
//             .put("/maps/save")
//             .send(newMap)
//             .set("Content-type", "application/json")
//         mapID = mapCreationResponse.body.map_id
//     })

//     afterAll(async () => {
//         await mongoose.disconnect()
//         await mongoose.connection.close()
//     })

//     it("should add a new comment", async () => {
//         const response = await supertest(app)
//             .post("/comments/addComment")
//             .send({ text: "This is example text", user_id: user_id, map_id: mapID })
//             .set("Content-type", "application/json")
//         expect(response.status).toBe(200)
//     })
// })