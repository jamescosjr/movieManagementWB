import { 
    createMovie,
    updateById,
    deleteById,
 } from "../../infrastructure/repository/movieRepositoryWrite.js";
import { 
    getAllMovies,
    findByTitle,
    findByGenre,
 } from "../../infrastructure/repository/movieRepositoryRead.js";
import { AppError } from '../error/customErros.js'

export async function createMovieService({ title, director, genre, year }) {
    try {
        return await createMovie({ title, director, genre, year });
    } catch (error) {
        throw new AppError(error.message || 'Error creating the movie', 500);
    }
}

export async function updateMovieService(id, { title, director, genre, year }) {
    try {
        return await updateById(id, { title, director, genre, year });
    } catch (error) {
        throw new AppError(error.message || 'Error updating the movie', 500);
    }
};

export async function deleteMovieService(id) {
    try {
        return await deleteById(id);
    } catch (error) {
        throw new AppError(error.message || 'Error deleting the movie', 500);
    }
}

export async function getAllMoviesService() {
    try {
        return await getAllMovies();
    } catch (error) {
        throw new AppError(error.message || 'Error getting all movies', 500);
    }
}

export async function findByTitleService(title) {
    try {
        return await findByTitle(title);
    } catch (error) {
        throw new AppError(error.message || 'Error getting movie by title', 500);
    }
}

export async function findByGenreService(genre) {
    try {
        return await findByGenre(genre);
    } catch (error) {
        throw new AppError(error.message || 'Error getting movie by genre', 500);
    }
}