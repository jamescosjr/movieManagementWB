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

describe("GET /movies/genre", () => {
    describe("success cases", () => {
        it("should return a movie by genre", async () => {
            const movie = new Movie({
                title: "Test Movie",
                director: "Test Director",
                genre: "Test Genre",
                year: 2021,
            });
            await movie.save();

            const response = await supertest(app).get("/movies/genre/Test Genre");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining([{
                title: movie.title,
                director: movie.director,
                genre: movie.genre,
                year: movie.year,
                id: expect.any(String),
                __v: 0,
            }]));
        });
    });
    describe("non success cases", () => {
        it("should return empty array when the movie is not found", async () => {
            const response = await supertest(app).get("/movies/genre/Test Genre").query({ genre: "Test Genre" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        it("should return status 500 with message on error", async () => {
            jest.spyOn(Movie, 'find').mockImplementationOnce(() => {
                throw new Error("Database error");
            });
            const response = await supertest(app).get("/movies/genre/Test Genre");
            expect(response.status).toBe(500);
        });
    });
});