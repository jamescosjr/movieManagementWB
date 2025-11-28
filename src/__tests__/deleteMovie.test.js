import supertest from "supertest";
import { Movie } from "../infrastructure/schema/movieSchema.js";
import { app } from "../../server";
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

describe("DELETE /movies:id", () => {
    describe("success cases", () => {
        it("should return 204 when a movie is deleted", async () => {
            const movie = new Movie({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
                year: 2000,
                _id: "677aa30f88a6da644245cae7",
                __v: 0,
            });
            await Movie.create(movie);

            const response = await supertest(app).delete(`/movies/677aa30f88a6da644245cae7`);

            expect(response.status).toBe(204);
        });
    });
    describe("non succes cases", () => {
        it("should return 404 when the movie is not found", async () => {
            const response = await supertest(app).delete(`/movies/677aa30f88a6da644245cae7`);

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: 'Movie not found'
            })
        });
    });
});