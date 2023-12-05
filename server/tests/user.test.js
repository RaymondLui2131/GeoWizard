const request = require("supertest")
const createServer = require("../utils/create_server")
const User = require("../models/user_model")
const { signToken, verifyToken } = require("../jwt_middleware")
const bcrypt = require("bcryptjs")
const UserController = require("../controllers/user_controllers")
const app = createServer()
const jwt = require("jsonwebtoken")

const user_data1 = {
    id: "123",
    username: "testuser",
    email: "test123@gmail.com",
}

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn()
}));


jest.mock("../models/user_model", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    select: jest.fn(),
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
    it('should get user data with valid bearer token', async () => {
        const token = signToken("123");

        const mockedUser = {
            _id: "123",
            username: "testUser",
            email: "test@example.com"
            // Add other necessary user details
        };
        jwt.verify.mockResolvedValueOnce({ id: "123" })
        // Mock the behavior of User.findById and select
        User.findById.mockReturnThis(); // Mocking chaining behavior

        // Mock the `select` function behavior to return the mocked user data
        User.findById().select.mockResolvedValueOnce(mockedUser);

        const res = await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200); // Expect a 200 status for valid token
        expect(res.body).toEqual(mockedUser); // Expect the response body to match the user data
        // Add more specific assertions if necessary
    });

    it('should fail with invalid bearer token', async () => {
        // Mock the `select` function behavior to return the mocked user data
        const res = await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer bad_token`);

        expect(res.status).toBe(401); // Expect a 200 status for valid token
        expect(res.body).toEqual({
            message: "Not authorized, token failed"
        }); // Expect the response body to match the user data
    });
});


describe("testing checkUniqueUser", () => {
    it('should return "User already exists" for existing username', async () => {
        // Mocking an existing username in the database
        User.findOne.mockResolvedValueOnce({ username: 'existingUser' });

        const res = await request(app)
            .get('/users/checkUniqueUser')
            .query({ username: 'existingUser' });

        expect(res.status).toBe(409);
        expect(res.body).toEqual({ message: 'User already exists' });
    });

    it('should return "User is unique" for non-existing username', async () => {
        // Mocking a non-existing username in the database
        User.findOne.mockResolvedValueOnce(null);

        const res = await request(app)
            .get('/users/checkUniqueUser')
            .query({ username: 'newUser' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'User is unique' });
    });
})


describe("testing checkUniqueEmail", () => {
    it('should return "Email already exists" for existing email', async () => {
        // Mocking an existing username in the database
        User.findOne.mockResolvedValueOnce({ email: 'existingEmail' });

        const res = await request(app)
            .get('/users/checkUniqueEmail')
            .query({ email: 'existingEmail' });

        expect(res.status).toBe(409);
        expect(res.body).toEqual({ message: 'Email already exists' });
    });

    it('should return "Email is unique" for non-existing email', async () => {
        // Mocking a non-existing username in the database
        User.findOne.mockResolvedValueOnce(null);

        const res = await request(app)
            .get('/users/checkUniqueEmail')
            .query({ email: 'newEmail' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Email is unique' });
    });
})


describe("testing getUserById", () => {
    it("should return user with correct id", async () => {
        const user = { _id: '123', username: 'testUser', email: 'test@example.com' }
        User.findById.mockResolvedValueOnce(user)
        const res = await request(app).get(`/users/${user._id}`)
        expect(res.status).toBe(200);
        expect(res.body).toEqual(user);
    })

    it("should fail if user not found", async () => {
        User.findById.mockResolvedValueOnce(null)
        const res = await request(app).get(`/users/123`)
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            message: "User not found"
        });
    })
})

describe("testing updateUserInfo", () => {
    it("should update user location successfully", async () => {
        const field = "location"
        const value = "Stony Brook, NY"
        const req = mockRequest({
            field: field,
            value: value
        })

        const user = { _id: "123", location: "", save: jest.fn() }
        req.user = user

        const res = mockResponse()

        user.save.mockImplementation(async () => {
            user[req.body.field] = req.body.value
            return user
        })

        await UserController.updateUserInfo(req, res)
        expect(user[field]).toEqual(value)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            user: user,
            value: value
        })
    })

    it("should update user about successfully", async () => {
        const field = "about"
        const value = "hello world"
        const req = mockRequest({
            field: field,
            value: value
        })

        const user = { _id: "123", about: "", save: jest.fn() }
        req.user = user

        const res = mockResponse()

        user.save.mockImplementation(async () => {
            user[req.body.field] = req.body.value
            return user
        })

        await UserController.updateUserInfo(req, res)
        expect(user[field]).toEqual(value)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            user: user,
            value: value
        })
    })

    it("should update user birthday successfully", async () => {
        const field = "birthday"
        const value = new Date()
        const req = mockRequest({
            field: field,
            value: value
        })

        const user = { _id: "123", birthday: "", save: jest.fn() }
        req.user = user

        const res = mockResponse()

        user.save.mockImplementation(async () => {
            user[req.body.field] = req.body.value
            return user
        })

        await UserController.updateUserInfo(req, res)
        expect(user[field]).toEqual(value)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            user: user,
            value: value
        })
    })

    it("should fail if field does not exist", async () => {
        const field = "bad"
        const value = new Date()
        const req = mockRequest({
            field: field,
            value: value
        })

        const user = { _id: "123", save: jest.fn() }
        req.user = user

        const res = mockResponse()

        user.save.mockImplementation(async () => {
            user[req.body.field] = req.body.value
            return user
        })

        await UserController.updateUserInfo(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            message: `field ${field} does not exist`
        })
    })

    it("should fail if network error", async () => {
        const field = "birthday"
        const value = new Date()
        const req = mockRequest({
            field: field,
            value: value
        })

        const user = { _id: "123", birthday: "", save: jest.fn() }
        req.user = user

        const res = mockResponse()

        user.save.mockResolvedValueOnce(null)

        await UserController.updateUserInfo(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
            message: "updateUserInfo failed"
        })
    })
})