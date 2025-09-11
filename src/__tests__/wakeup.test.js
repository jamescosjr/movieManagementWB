import supertest from "supertest";
import { Movie } from "../infrastructure/schema/movieSchema.js";
import { app } from "../../server.js";
import { AppError, ValidationError } from "../domain/error/customErros.js";
const dbHandler = require('../../jest/jest.setup.js');

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe("GET /wakeup", () => {
    it("should return 200 and a wakeup message", async () => {
        const response = await supertest(app).get("/wakeup");
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ message: "I'm awake!" });
    });
});
