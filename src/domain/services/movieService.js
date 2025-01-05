import { 
    createMovie,
    updateById,
    deleteById,
 } from "../../infrastructure/repository/movieRepositoryWrite.js";
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