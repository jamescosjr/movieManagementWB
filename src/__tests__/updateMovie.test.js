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

describe("PUT /movies:id", () => {
    describe("success cases", () => {
        it("should return 200 when a movie is updated", async () => {
            const movie = new Movie({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
                year: 2000,
                _id: "677aa30f88a6da644245cae7",
                __v: 0,
            });
            await Movie.create(movie);

            const response = await supertest(app).put(`/movies/677aa30f88a6da644245cae7`).send({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
                year: 2001,
            });

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                title: 'The Shawshank Redemption',
                director: 'Frank Darabont',
                genre: 'Drama',
                year: 2001,
                _id: expect.any(String),
                __v: 0
            })
        });
    });
    describe("non succes cases", () => {
        it("should return 404 when the movie is not found", async () => {
            const response = await supertest(app).put(`/movies/677aa30f88a6da644245cae7`).send({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
                year: 2001,
            });

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: 'Movie not found',
            })
        });
        it("should return 400 when update with the wrong data", async () => {
            const movie = new Movie({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
                year: 2000,
                _id: "677aa30f88a6da644245cae7",
                __v: 0,
            });

            await Movie.create(movie);

            const response = await supertest(app).put(`/movies/677aa30f88a6da644245cae7`).send({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
                year: "2001",
            });

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: 'The year should be a valid number',
            })
        });
    });
});