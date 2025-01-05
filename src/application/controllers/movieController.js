import {
    createMovieService,
    updateMovieService
  } from "../../domain/services/movieService.js";
  import { AppError, ValidationError, NotFoundError } from "../../domain/error/customErros.js";
  import { validMovieData } from "../../domain/utils/validation.js";
  
  export async function registerMovieHandler(req, res, next) {
    const { title, director, genre, year } = req.body;

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