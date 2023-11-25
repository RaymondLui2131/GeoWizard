const request = require("supertest")
const createServer = require("../utils/create_server")
const User = require("../models/user_model")
const { signToken, verifyToken } = require("../jwt_middleware")
const bcrypt = require("bcryptjs")
const UserController = require("../controllers/user_controllers")
const app = createServer()

const user_data1 = {
    id: "123",
    username: "testuser",
    email: "test123@gmail.com",
}

jest.mock("../models/user_model", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn()
}));

jest.mock("bcryptjs", () => ({
    compare: jest.fn(),
    genSalt: jest.fn(),
    hash: jest.fn()
}));

jest.mock('../jwt_middleware', () => {
    const originalModule = jest.requireActual('../jwt_middleware');

    return {
        ...originalModule,
        signToken: jest.fn(), // Mock only the signToken function
        verifyToken: jest.fn()
    };
});

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

    it("should fail if missing email", async () => {
        const req = mockRequest({
            password: "abc123"
        })

        const res = mockResponse()

        User.findOne.mockResolvedValue(user_data1); // returns user_data1
        bcrypt.compare.mockResolvedValue(true); // returns true for bcrypt.compare
        signToken.mockReturnValue("token_123");  // returns mocked token value

        await UserController.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith( // expected return value
            {
                message: "Missing required fields for login"
            }
        );
    })

    it("should fail if missing password", async () => {
        const req = mockRequest({
            email: "test123@gmail.com"
        })

        const res = mockResponse()

        User.findOne.mockResolvedValue(user_data1); // returns user_data1
        bcrypt.compare.mockResolvedValue(true); // returns true for bcrypt.compare
        signToken.mockReturnValue("token_123");  // returns mocked token value

        await UserController.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith( // expected return value
            {
                message: "Missing required fields for login"
            }
        );
    })

    it("should fail if wrong email", async () => {
        const req = mockRequest({
            email: "invalid@gmail.com", // Assuming this email does not exist in your user data
            password: "invalidpassword", // Invalid password
        });

        const res = mockResponse();

        User.findOne.mockResolvedValue(null); // Simulate no user found with the provided email
        bcrypt.compare.mockResolvedValue(false); // Simulate password comparison failure
        signToken.mockReturnValue("token_123"); // Ensure signToken is not called

        await UserController.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401); // Expect a 401 status for invalid credentials
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid credentials"
        });
    });
});

describe("testing registering user", () => {
    it("should successfully register a user", async () => {
        const req = mockRequest({
            email: "newemail@gmail.com",
            username: "newuser",
            password: "password123"
        });

        const res = mockResponse();

        User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null); // Simulate that email and username do not exist
        bcrypt.genSalt.mockResolvedValue("salt123");
        bcrypt.hash.mockResolvedValue("hashedpassword123");
        User.create.mockResolvedValue({
            id: "123",
            email: "newemail@gmail.com",
            username: "newuser"
        });
        signToken.mockReturnValue("token_123");

        await UserController.registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200); // Expect a 200 status for successful registration
        expect(res.json).toHaveBeenCalledWith({
            _id: "123",
            username: "newuser",
            email: "newemail@gmail.com",
            token: "token_123",
        });
    });
    it("should handle missing username", async () => {
        const req = mockRequest({
            // Missing the username field intentionally
            email: "test123@gmail.com",
            password: "abc123"
        });

        const res = mockResponse();

        await UserController.registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400); // Expect a 400 status for missing fields
        expect(res.json).toHaveBeenCalledWith({
            message: "Missing required fields for register",
        });
    });

    it("should handle existing email", async () => {
        const req = mockRequest({
            email: "existingemail@gmail.com", // Assume this email already exists in the database
            username: "newuser",
            password: "password123"
        });

        const res = mockResponse();

        User.findOne
            .mockResolvedValueOnce({}); // Simulate that email already exists

        await UserController.registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(409); // Expect a 409 status for existing email
        expect(res.json).toHaveBeenCalledWith({
            message: "Email already exists",
        });
    });

    it("should handle existing username", async () => {
        const req = mockRequest({
            email: "newemail@gmail.com",
            username: "existinguser", // Assume this username already exists in the database
            password: "password123"
        });

        const res = mockResponse();

        User.findOne
            .mockResolvedValueOnce(null) // Simulate that email doesn't exist
            .mockResolvedValueOnce({}); // Simulate that username already exists

        await UserController.registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(409); // Expect a 409 status for existing username
        expect(res.json).toHaveBeenCalledWith({
            message: "User already exists",
        });
    });
})

describe('Testing getUser function', () => {

});


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