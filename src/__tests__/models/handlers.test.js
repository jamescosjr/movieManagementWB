/* eslint-disable no-undef */
import {
  registerMovieHandler,
  listMoviesHandler,
  findMovieByTitleHandler,
  listMoviesbyGenreHandler,
  listMoviesByDirectorHandler,
  listMoviesByYearHandler,
  deleteMovieHandler,
  updateMovieHandler,
} from "../../controllers/movieController.js";
import * as movieRepository from "../../repository/movieRepository.js";

describe("Movie Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should test the registerMovieHandler", async () => {
    const req = {
      body: {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const spy = jest
      .spyOn(movieRepository, "register")
      .mockReturnValue(req.body);

    await registerMovieHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it("should test the listMoviesHandler", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const movies = [
      {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
      },
    ];

    const spy = jest.spyOn(movieRepository, "findAll").mockReturnValue(movies);

    await listMoviesHandler(req, res);

    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(movies);
  });

  it("should test the findMovieByTitleHandler", async () => {
    const req = {
      params: {
        title: "The Godfather",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const movie = {
      title: "The Godfather",
      director: "Francis Ford Coppola",
      genre: "Crime",
      year: 1972,
    };

    const spy = jest
      .spyOn(movieRepository, "findByTitle")
      .mockReturnValue(movie);

    await findMovieByTitleHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.title);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(movie);
  });

  it("should test the listMoviesbyGenreHandler", async () => {
    const req = {
      params: {
        genre: "Crime",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const movies = [
      {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
      },
    ];

    const spy = jest
      .spyOn(movieRepository, "listByGenre")
      .mockReturnValue(movies);

    await listMoviesbyGenreHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.genre);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(movies);
  });

  it("should test the listMoviesByDirectorHandler", async () => {
    const req = {
      params: {
        director: "Francis Ford Coppola",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const movies = [
      {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
      },
    ];

    const spy = jest
      .spyOn(movieRepository, "listByDirector")
      .mockReturnValue(movies);

    await listMoviesByDirectorHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.director);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(movies);
  });

  it("should test the listMoviesByYearHandler", async () => {
    const req = {
      params: {
        year: 1972,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const movies = [
      {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
      },
    ];

    const spy = jest
      .spyOn(movieRepository, "listByYear")
      .mockReturnValue(movies);

    await listMoviesByYearHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.year);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(movies);
  });

  it("should test the deleteMovieHandler", async () => {
    const req = {
      params: {
        id: "some-uuid-id",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const spy = jest
      .spyOn(movieRepository, "deleteById")
      .mockReturnValue({ id: req.params.id, title: "Some Movie" });

    await deleteMovieHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalled();
  });

  it("should test the updateMovieHandler", async () => {
    const req = {
      params: {
        id: "some-uuid-id",
      },
      body: {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const spy = jest
      .spyOn(movieRepository, "updateById")
      .mockReturnValue({ id: req.params.id, ...req.body });

    await updateMovieHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.id, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: req.params.id, ...req.body });
  });

  it("should test the updateMovieHandler when movie is not found", async () => {
    const req = {
      params: {
        id: "some-uuid-id",
      },
      body: {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const spy = jest.spyOn(movieRepository, "updateById").mockReturnValue(null);

    await updateMovieHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.id, req.body);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Movie not found" });
  });

  it("should test the listMoviesByYearHandler when year is not found", async () => {
    const req = {
      params: {
        year: 2020,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const spy = jest.spyOn(movieRepository, "listByYear").mockReturnValue([]);

    await listMoviesByYearHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.year);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Year not found" });
  });

  it("should test the listMoviesByDirectorHandler when director is not found", async () => {
    const req = {
      params: {
        director: "Some Director",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const spy = jest.spyOn(movieRepository, "listByDirector").mockReturnValue([]);

    await listMoviesByDirectorHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.director);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Director not found" });
  });

  it("should test the findMovieByTitleHandler when movie is not found", async () => {
    const req = {
      params: {
        title: "The Godfather",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const spy = jest.spyOn(movieRepository, "findByTitle").mockReturnValue(null);

    await findMovieByTitleHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.title);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Movie not found" });
  });

  it("should test the listMoviesbyGenreHandler when genre is not found", async () => {
    const req = {
      params: {
        genre: "Some Genre",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const spy = jest.spyOn(movieRepository, "listByGenre").mockReturnValue([]);

    await listMoviesbyGenreHandler(req, res);

    expect(spy).toHaveBeenCalledWith(req.params.genre);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Genre not found" });
  });

  it("should test the registerMovieHandler when an error occurs", async () => {
    const req = {
      body: {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(movieRepository, "register").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    await registerMovieHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });

  it("should test the listMoviesHandler when an error occurs", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(movieRepository, "findAll").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    await listMoviesHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });

  it("should test the deleteMovieHandler when an error occurs", async () => {
    const req = {
      params: {
        id: "some-uuid-id",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(movieRepository, "deleteById").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    await deleteMovieHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });

  it("should test the updateMovieHandler when an error occurs", async () => {
    const req = {
      params: {
        id: "some-uuid-id",
      },
      body: {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genre: "Crime",
        year: 1972,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(movieRepository, "updateById").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    await updateMovieHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });

  it("should test the listMoviesByYearHandler when an error occurs", async () => {
    const req = {
      params: {
        year: 1972,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(movieRepository, "listByYear").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    await listMoviesByYearHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});
