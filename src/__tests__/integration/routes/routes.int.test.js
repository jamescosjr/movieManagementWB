/* eslint-disable no-undef */
import request from "supertest";
import { app, server } from "../../../../server.js";
import { movies } from "../../../../src/repository/movieRepository.js";
afterAll((done) => {
  server.close(done);
});

describe("Integration tests for routes", () => {
  beforeEach(() => {
    jest.resetModules();
    movies.splice(0, movies.length);
  });

  it("should test all the proccess of registering an employee", async () => {
    const movie = {
      title: "The Godfather",
      director: "Francis Ford Coppola",
      genre: "Crime",
      year: 1972,
    };

    const response = await request(app).post("/movies").send(movie);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(movie));
    expect(movies).toEqual(expect.arrayContaining([expect.objectContaining(movie)]));
  });

    it("should test the process of listing all movies", async () => {
        const movie = {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
        };
    
        await request(app).post("/movies").send(movie);
    
        const response = await request(app).get("/movies");
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(movie)]));
    });

    it("should test the process of finding a movie by title", async () => {
        const movie = {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
        };
    
        await request(app).post("/movies").send(movie);
    
        const response = await request(app).get(`/movies/${movie.title}`);
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(movie));
    });

    it("should test the process of listing movies by genre", async () => {
        const movie = {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
        };
    
        await request(app).post("/movies").send(movie);
    
        const response = await request(app).get(`/movies/genre/${movie.genre}`);
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(movie)]));
    });

    it("should test the process of listing movies by director", async () => {
        const movie = {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
        };
    
        await request(app).post("/movies").send(movie);
    
        const response = await request(app).get(`/movies/director/${movie.director}`);
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(movie)]));
    });

    it("should return 200 when list movies from a specific year", async () => {
        const movie = {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
        };

        await request(app).post("/movies").send(movie);

        const response = await request(app).get(`/movies/year/${movie.year}`);

        expect(response.status).toBe(200);
    });

    it("should return 404 when list movies from a specific year that does not exist", async () => {
        const response = await request(app).get("/movies/year/2020");

        expect(response.status).toBe(404);
    });

    it("should return 404 when a movie is not found", async () => {
        const response = await request(app).get("/movies/unknown");

        expect(response.status).toBe(404);
    });
});
