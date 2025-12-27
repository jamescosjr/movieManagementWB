import {
    createMovieService,
    updateMovieService,
    deleteMovieService,
  } from "../../domain/services/movieService.js";
  import { 
    getAllMoviesService,
    findByTitleService,
    findByGenreService,
    findByDirectorService,
    findByYearService,
    searchMoviesService
 } from "../../domain/services/movieService.js";
  import { ValidationError, NotFoundError } from "../../domain/error/customErros.js";
  import { validMovieData } from "../../domain/utils/validation.js";
  
  export async function registerMovieHandler(req, res, next) {
    const { title, director, year, genre  } = req.body;

    const validation = validMovieData(title, director, genre, year);
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }

    try {
        const result = await createMovieService({ title, director, genre, year });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function updateMovieHandler(req, res, next) {
    const { id } = req.params;
    const { title, director, genre, year } = req.body;

    const validation = validMovieData(title, director, genre, year);
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }

    try {
        const result = await updateMovieService(id, { title, director, genre, year });
        if (!result) {
            return next(new NotFoundError('Movie not found'));
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function deleteMovieHandler(req, res, next) {
    const { id } = req.params;

    try {
        const result = await deleteMovieService(id);
        if (!result) {
            return next(new NotFoundError('Movie not found'));
        }
        res.status(204).end();
    } catch (error) {
        console.warn(error)

        next(error);
    }
}

export async function getAllMoviesHandler(req, res, next) {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        

        if (page < 1 || limit < 1) {
            return;
        }

        const result = await getAllMoviesService(page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function findMovieByTitleHandler(req, res, next) {
    const { title } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
            return next(new ValidationError("Page and limit must be positive integers."));
        }

    try {
        const result = await findByTitleService(title, page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function listMoviesbyGenreHandler(req, res, next) {
    const { genre } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
            return next(new ValidationError("Page and limit must be positive integers."));
        }

    try {
        const result = await findByGenreService(genre, page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function listMoviesbyDirectorHandler(req, res, next) {
    const { director } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
            return next(new ValidationError("Page and limit must be positive integers."));
        }

    try {
        const result = await findByDirectorService(director, page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function listMoviesbyYearHandler(req, res, next) {
    const { year } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
            return next(new ValidationError("Page and limit must be positive integers."));
        }

    try {
        const result = await findByYearService(year, page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function searchMoviesHandler(req, res, next) {
    const { searchType, searchTerm } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
        return next(new ValidationError("Page and limit must be positive integers."));
    }

    try {
        const result = await searchMoviesService({ searchType, searchTerm, page, limit });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function wakeupHandler(req, res) {
    res.status(200).json({ message: "I'm awake!" });
}