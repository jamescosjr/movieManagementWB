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

describe("GET /movies", () => {
    describe("success cases", () => {
        it("should return 200 and an array of movies", async () => {
            const movie = new Movie({
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
                year: 2000,
                _id: "677aa30f88a6da644245cae7",
                __v: 0,
            });
            await Movie.create(movie);

            const response = await supertest(app).get(`/movies`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject([{
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                genre: "Drama",
                year: 2000,
                id: "677aa30f88a6da644245cae7",
                __v: 0,
            }]);
        });
        it("should return 200 and an empty array when there are no movies", async () => {
            await dbHandler.clearDatabase();

            const response = await supertest(app).get(`/movies`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject([]);
        });
    });
    describe("non succes cases", () => {
        it("should return 500 when there is an error", async () => {
            jest.spyOn(Movie, 'find').mockImplementationOnce(() => {
                throw new Error("Database error");
            });

            const response = await supertest(app).get("/movies");
            expect(response.status).toBe(500);
        });
    });
});