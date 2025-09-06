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

describe("GET /movies/search", () => {
    it("should return a list of movies matching the search query", async () => {
        const movie1 = new Movie({
            title: "Inception",
            director: "Christopher Nolan",
            genre: "Sci-Fi",
            year: 2010
        });
        await movie1.save();

        const movie2 = new Movie({
            title: "The Dark Knight",
            director: "Christopher Nolan",
            genre: "Action",
            year: 2008
        });
        await movie2.save();

        const response = await supertest(app)
            .get("/search")
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Inception",
                    director: "Christopher Nolan",
                    genre: "Sci-Fi",
                    year: 2010
                })
            ])
        );
    });

    it("should return the list if only the title is on the search query", async () => {
        const movie1 = new Movie({
            title: "Inception",
            director: "Christopher Nolan",
            genre: "Sci-Fi",
            year: 2010
        });
        await movie1.save();

        const movie2 = new Movie({
            title: "The Dark Knight",
            director: "Christopher Nolan",
            genre: "Action",
            year: 2008
        });
        await movie2.save();

        const response = await supertest(app)
            .get("/search")
            .query({ title: "Inception" });

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Inception",
                    director: "Christopher Nolan",
                    genre: "Sci-Fi",
                    year: 2010
                })
            ])
        );
    });

    it("should return the list if only the director is on the search query", async () => {
        const movie1 = new Movie({
            title: "Inception",
            director: "Christopher Nolan",
            genre: "Sci-Fi",
            year: 2010
        });
        await movie1.save();

        const movie2 = new Movie({
            title: "The Dark Knight",
            director: "Christopher Nolan",
            genre: "Action",
            year: 2008
        });
        await movie2.save();

        const response = await supertest(app)
            .get("/search")
            .query({ director: "Christopher Nolan" });

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Inception",
                    director: "Christopher Nolan",
                    genre: "Sci-Fi",
                    year: 2010
                }),
                expect.objectContaining({
                    title: "The Dark Knight",
                    director: "Christopher Nolan",
                    genre: "Action",
                    year: 2008
                })
            ])
        );
    });
    it("should return the list if only the genre is on the search query", async () => {
        const movie1 = new Movie({
            title: "Inception",
            director: "Christopher Nolan",
            genre: "Sci-Fi",
            year: 2010
        });
        await movie1.save();

        const movie2 = new Movie({
            title: "The Dark Knight",
            director: "Christopher Nolan",
            genre: "Action",
            year: 2008
        });
        await movie2.save();

        const response = await supertest(app)
            .get("/search")
            .query({ searchType: "genre", searchTerm: "Action" });

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "The Dark Knight",
                    director: "Christopher Nolan",
                    genre: "Action",
                    year: 2008
                })
            ])
        );
    });
    it("should return the list if only the year is on the search query", async () => {
        const movie1 = new Movie({
            title: "Inception",
            director: "Christopher Nolan",
            genre: "Sci-Fi",
            year: 2010
        });
        await movie1.save();

        const movie2 = new Movie({
            title: "The Dark Knight",
            director: "Christopher Nolan",
            genre: "Action",
            year: 2008
        });
        await movie2.save();

        const response = await supertest(app)
            .get("/search")
            .query({ searchType: "year", searchTerm: 2008 });

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "The Dark Knight",
                    director: "Christopher Nolan",
                    genre: "Action",
                    year: 2008
                })
            ])
        );
    });
});
