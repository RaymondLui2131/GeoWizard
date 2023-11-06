const supertest = require("supertest")
const createServer = require("../utils/create_server")
const mongoose = require("mongoose")
const User = require("../models/user_model")
const { MongoMemoryServer } = require("mongodb-memory-server")
const { signToken } = require("../jwt_middleware")
const { registerUser } = require("../controllers/user_controllers")

//For local
// const app = createServer()
// const HOST = app
const HOST = "https://geowizard-app-b802ae01ce7f.herokuapp.com"
describe("testing POST users/register", () => {
    beforeAll(async () => {
        const testServer = await MongoMemoryServer.create()
        await mongoose.connect(testServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })
    const user_data1 = {
        email: "test123@gmail.com",
        username: "testuser",
        password: "abc123"
    }

    const user_data2 = {
        email: "bob123@gmail.com",
        password: "abc123"
    }

    const user_data3 = null

    it("should successfully create a user", async () => {
        const response = await supertest(HOST)
            .post("/users/register")
            .send(user_data1)
            .set("Content-type", "application/json")
        console.log("Creating user")
        console.log(response.status)
        console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            _id: expect.any(String),
            username: "testuser",
            email: "test123@gmail.com",
            token: signToken(response.body._id)
        })

        const registered_user = await User.findOne({ email: user_data1.email })
        expect(registered_user).toBeTruthy()
    })

    it("should fail if user already exists", async () => {
        const response = await supertest(HOST)
            .post("/users/register")
            .send(user_data1)
            .set("Content-type", "application/json")
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            message: "User already exists"
        })
    })

    it("should fail if missing required fields", async () => {
        const response = await supertest(HOST)
            .post("/users/register")
            .send(user_data2)
            .set("Content-type", "application/json")
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            message: "Missing required fields for register"
        })
    })
})

describe("testing GET users/me", () => {
    beforeAll(async () => {
        const testServer = await MongoMemoryServer.create()
        await mongoose.connect(testServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    it("should return the user with the correct token", async () => {
        const user = await User.create({
            email: 'test@example.com',
            username: 'testuser',
            password: 'abc123',
        })

        const token = signToken(user._id)
        const response = await supertest(HOST)
            .get("/users/me")
            .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    it("should fail the user with incorrect token", async () => {
        const user = await User.create({
            email: 'test@example.com',
            username: 'testuser',
            password: 'abc123',
        })

        const token = "123"
        const response = await supertest(HOST)
            .get("/users/me")
            .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            message: "Not authorized, token failed"
        })
    })

    it("should fail the user without a token", async () => {
        const user = await User.create({
            email: 'test@example.com',
            username: 'testuser',
            password: 'abc123',
        })

        const response = await supertest(HOST)
            .get("/users/me")
            .set("Authorization", "Bearer ")
        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            message: "Not authorized, token failed"
        })
    })
})


describe("test POST users/login", () => {
    beforeAll(async () => {
        const testServer = await MongoMemoryServer.create()
        await mongoose.connect(testServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    it("should successfully login a user", async () => {
        const registerUserResponse = await supertest(HOST)
            .post("/users/register")
            .send({
                email: 'test@example.com',
                username: 'testuser',
                password: 'abc123',
            })
            .set("Content-type", "application/json")

        expect(registerUserResponse.status).toBe(200)

        const response = await supertest(HOST)
            .post("/users/login")
            .send({ email: "test@example.com", password: "abc123" })
            .set("Content-type", "application/json")
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            _id: expect.any(String),
            username: "testuser",
            email: "test@example.com",
            token: signToken(response.body._id)
        })
    })

    it("should fail if missing required fields", async () => {
        const response = await supertest(HOST)
            .post("/users/login")
            .send({ email: "test@example.com" })
            .set("Content-type", "application/json")
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            message: "Missing required fields for login"
        })
    })

    it("should fail if invalid credentials", async () => {
        const response = await supertest(HOST)
            .post("/users/login")
            .send({ email: "test@example.com", password: "wrongpass" })
            .set("Content-type", "application/json")
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            message: "Invalid credentials"
        })
    })
})

describe('testing static file serving', () => {
    beforeAll(async () => {
        const testServer = await MongoMemoryServer.create()
        await mongoose.connect(testServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })
    it('should serve the static files and handle catch-all route', async () => {
        const response = await supertest(HOST)
            .get('/any') // This route will match the catch-all route
            .expect(200)
            .expect('Content-Type', "text/html; charset=UTF-8")
    })
})
