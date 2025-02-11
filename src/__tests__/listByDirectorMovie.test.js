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

describe("GET /movies/director/director", () => {
    describe("success cases", () => {
        it("should return a movie by director", async () => {
            const movie = new Movie({
                title: "Test Movie",
                director: "Test Director",
                genre: "Test Genre",
                year: 2021,
            });
            await movie.save();

            const response = await supertest(app).get("/movies/director/Test Director");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining([{
                title: movie.title,
                director: movie.director,
                genre: movie.genre,
                year: movie.year,
                _id: expect.any(String),
                __v: 0,
            }]));
        });
    });
    describe("non success cases", () => {
        it("should return 404 when the movie is not found", async () => {
            const response = await supertest(app).get("/movies/director/Test Director").query({ director: "Test Director" });

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: "Movie not found",
            });
        });
        it("should return status 500 with message on error", async () => {
            jest.spyOn(Movie, 'find').mockRejectedValue(new Error('Internal server error'));
            const response = await supertest(app).get("/movies/director/Test Director");
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });
});