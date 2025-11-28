import supertest from "supertest";
import { Movie } from "../infrastructure/schema/movieSchema.js";
import { app } from "../../server";
import { AppError } from "../domain/error/customErros";
const dbHandler = require('../../jest/jest.setup');

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe("POST /movies", () => {
    describe("success cases", () => {
        it("should return 201 when a movie is registered", async () => {
            const response = await supertest(app).post("/movies").send({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
                year: 2000,
            });

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                    title: 'The Shawshank Redemption',
                    director: 'Frank Darabont',
                    genre: 'Drama',
                    year: 2000,
                    _id: expect.any(String),
                    __v: 0
            })
        });
    });
    describe("non success cases", () => {
        it("should return 400 when title is not provided", async () => {
            const response = await supertest(app).post("/movies").send({
                director: "Frank Darabont",
                genre: "Drama",
                year: 2000,
            });

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "The title should be a valid string",
            });
        });
        it("should return 400 when director is not provided", async () => {
            const response = await supertest(app).post("/movies").send({
                title: "The Shawshank Redemption",
                genre: "Drama",
                year: 2000,
            });

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "The director should be a valid string",
            });
        });
        it("should return 400 when genre is not provided", async () => {
            const response = await supertest(app).post("/movies").send({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                year: 2000,
            });

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "The genre should be a valid string",
            });
        });
        it("should return 400 when year is not provided", async () => {
            const response = await supertest(app).post("/movies").send({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
            });

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "The year should be a valid number",
            });
        });
        it("should return 400 when title is not a string", async () => {
            const response = await supertest(app).post("/movies").send({
                title: 123,
                director: "Frank Darabont",
                genre: "Drama",
                year: 2000,
            });

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "The title should be a valid string",
            });
        });
        it("should return 500", async () => {
            jest.spyOn(Movie.prototype, 'save').mockImplementationOnce(() => {
                throw new AppError("Database error");
            });
            const response = await supertest(app).post("/movies").send({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
                year: 2000,
            });

            expect(response.status).toBe(500);
            expect(response.body).toMatchObject({
                message: "Database error",
            });
        });
    });
});