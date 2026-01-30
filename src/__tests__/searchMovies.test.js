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
            .query({ page: 0, limit: 10 });

        expect(response.status).toBe(200);
        // exact match: response should contain both movies sorted by title
        const actualAll = response.body.data.sort((a, b) => a.title.localeCompare(b.title));
        expect(actualAll).toEqual([
            {
                id: movie1._id.toString(),
                title: "Inception",
                director: "Christopher Nolan",
                genre: "Sci-Fi",
                year: 2010,
                __v: 0
            },
            {
                id: movie2._id.toString(),
                title: "The Dark Knight",
                director: "Christopher Nolan",
                genre: "Action",
                year: 2008,
                __v: 0
            }
        ]);
    });

    it("should return the list filtering by title using searchType and searchTerm strategy", async () => {
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
        .query({ 
            page: 1,          
            limit: 10,        
            searchType: "title",
            searchTerm: "Incepti"
        });

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(1); 
    
    expect(response.body.data[0]).toEqual(
        expect.objectContaining({
            title: "Inception",
            director: "Christopher Nolan"
        })
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
            .query({ director: "Christopher Nolan", page: 0, limit: 10 });

        expect(response.status).toBe(200);
        const actualByDirector = response.body.data.sort((a, b) => a.title.localeCompare(b.title));
        expect(actualByDirector).toEqual([
            {
                id: movie1._id.toString(),
                title: "Inception",
                director: "Christopher Nolan",
                genre: "Sci-Fi",
                year: 2010,
                __v: 0
            },
            {
                id: movie2._id.toString(),
                title: "The Dark Knight",
                director: "Christopher Nolan",
                genre: "Action",
                year: 2008,
                __v: 0
            }
        ]);
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
            .query({ searchType: "genre", searchTerm: "Action", page: 0, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([
            {
                id: movie2._id.toString(),
                title: "The Dark Knight",
                director: "Christopher Nolan",
                genre: "Action",
                year: 2008,
                __v: 0
            }
        ]);
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
            .query({ searchType: "year", searchTerm: 2008, page: 0, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([
            {
                id: movie2._id.toString(),
                title: "The Dark Knight",
                director: "Christopher Nolan",
                genre: "Action",
                year: 2008,
                __v: 0
            }
        ]);
    });
});
