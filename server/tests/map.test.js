const User = require("../models/user_model")
const Map = require("../models/map_model")
const MapController = require("../controllers/map_controllers")
const MapData = require("../models/map_data_model")

jest.mock("../models/map_model", () => ({
    find: jest.fn(),
    create: jest.fn()
}))

jest.mock("../models/map_data_model", () => ({
    create: jest.fn()
}))

const mockRequest = (body) => ({
    body
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("testing getUserMaps", () => {
    it("should return maps for a user", async () => {
        const req = mockRequest({
            userData: {
                maps: ['id_1', 'id_2', 'id_3']
            }
        })

        const res = mockResponse()
        const maps = [
            { _id: 'id_1', title: 'Map 1' },
            { _id: 'id_2', title: 'Map 2' },
            { _id: 'id_3', title: 'Map 3' },
        ]
        Map.find.mockResolvedValue(maps)

        await MapController.getUserMaps(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(maps);
    })

    it("should fail if network error", async () => {
        const req = mockRequest({
            userData: {
                maps: ['id_1', 'id_2', 'id_3']
            }
        })

        const res = mockResponse()
        Map.find.mockResolvedValue(null)

        await MapController.getUserMaps(req, res)
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "getUserMaps failed"
        });
    })
})

describe("testing createMap", () => {
    it("should create map successfully", async () => {
        const req = mockRequest({
            title: 'Test Map',
            isPublic: true,
            mapType: 'type',
            description: 'Test description',
            mapInfo: {
                original_map: 'original_data',
                edits: 'edited_data'
            }
        })

        const user = { _id: "123" }
        MapData.create.mockResolvedValue({
            _id: 'map_data_id'
        })
        Map.create.mockResolvedValue({
            _id: 'map_id'
        })

        const res = await MapController.createMap(req, user)
        expect(res).toBe('map_id')
    })

    it("should fail if user is not verified", async () => {
        const req = mockRequest({
            title: 'Test Map',
            isPublic: true,
            mapType: 'type',
            description: 'Test description',
            mapInfo: {
                original_map: 'original_data',
                edits: 'edited_data'
            }
        })

        MapData.create.mockResolvedValue({
            _id: 'map_data_id'
        })
        Map.create.mockResolvedValue({
            _id: 'map_id'
        })

        const res = await MapController.createMap(req, null)
        expect(res).toEqual({
            message: "User is not authenticated"
        })
    })

    it("should fail if missing title", async () => {
        const req = mockRequest({
            isPublic: true,
            mapType: 'type',
            description: 'Test description',
            mapInfo: {
                original_map: 'original_data',
                edits: 'edited_data'
            }
        })

        MapData.create.mockResolvedValue({
            _id: 'map_data_id'
        })
        Map.create.mockResolvedValue({
            _id: 'map_id'
        })

        const res = await MapController.createMap(req, { _id: "123" })
        expect(res).toEqual({
            message: "Missing required fields for map creation"
        })
    })

    it("should fail if missing mapInfo", async () => {
        const req = mockRequest({
            titel: "123",
            isPublic: true,
            mapType: 'type',
            description: 'Test description',
        })

        MapData.create.mockResolvedValue({
            _id: 'map_data_id'
        })
        Map.create.mockResolvedValue({
            _id: 'map_id'
        })

        const res = await MapController.createMap(req, { _id: "123" })
        expect(res).toEqual({
            message: "Missing required fields for map creation"
        })
    })

    it("should fail if network error on map data", async () => {
        const req = mockRequest({
            title: 'Test Map',
            isPublic: true,
            mapType: 'type',
            description: 'Test description',
            mapInfo: {
                original_map: 'original_data',
                edits: 'edited_data'
            }
        })

        MapData.create.mockResolvedValue(null)
        Map.create.mockResolvedValue(null)

        const res = await MapController.createMap(req, { _id: "123" })
        expect(res).toEqual({
            message: "Map Data creation failed"
        })
    })

    it("should fail if network error on map", async () => {
        const req = mockRequest({
            title: 'Test Map',
            isPublic: true,
            mapType: 'type',
            description: 'Test description',
            mapInfo: {
                original_map: 'original_data',
                edits: 'edited_data'
            }
        })

        MapData.create.mockResolvedValue({
            _id: 'map_data_id'
        })
        Map.create.mockResolvedValue(null)

        const res = await MapController.createMap(req, { _id: "123" })
        expect(res).toEqual({
            message: "Map creation failed"
        })
    })
})

describe("testing saveUserMap", () => {
    it("should fail if user is not authenticated", async () => {
        const req = mockRequest({
            user: null
        })

        const res = mockResponse()

        await MapController.saveUserMap(req, res)
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "User is not authenticated"
        });
    })

    it("should fail if save user map failed", async () => {
        const req = mockRequest({
            title: 'Test Map',
            isPublic: true,
            mapType: 'type',
            description: 'Test description',
            mapInfo: {
                original_map: 'original_data',
                edits: 'edited_data'
            },
        })

        req.user = { _id: "123" }

        const res = mockResponse()
        jest.spyOn(MapController, 'createMap').mockResolvedValue({
            message: "Map Data creation failed"
        })
        await MapController.saveUserMap(req, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Save user map failed"
        });
    })

    it("should save the user map successfully", async () => {
        const req = mockRequest({
            title: 'Test Map',
            isPublic: true,
            mapType: 'type',
            description: 'Test description',
            mapInfo: {
                original_map: 'original_data',
                edits: 'edited_data'
            },
        })

        const user = { _id: "user_id", maps: [], save: jest.fn() }
        req.user = user

        const res = mockResponse()
        MapData.create.mockResolvedValue({
            _id: 'map_data_id'
        })
        Map.create.mockResolvedValue({
            _id: 'map_id'
        })
        // jest.spyOn(MapController, 'createMap').mockResolvedValue("map_id")
        await MapController.saveUserMap(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user_id: "user_id",
            map_id: "map_id"
        });
        
        expect(user.maps).toContain("map_id");
        // Assertion to check if `save()` method was called
        expect(user.save).toHaveBeenCalled();
    })
})


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