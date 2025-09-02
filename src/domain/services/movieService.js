import { 
    createMovie,
    updateById,
    deleteById,
 } from "../../infrastructure/repository/movieRepositoryWrite.js";
import { 
    getAllMovies,
    findByTitle,
    findByGenre,
    findByDirector,
    findByYear
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

export async function getAllMoviesService(page, limit) {
    try {
        const movies = await getAllMovies(page, limit);

        if (!movies || movies.length === 0) {
            return [];
        }

        const formattedMovies = movies.map(movie => {
            const movieObject = movie.toObject(); 
            
            if (movieObject && movieObject._id !== undefined) {
                const { _id, ...rest } = movieObject;
                return { ...rest, id: _id };
            }
            return movieObject;
        });

        return formattedMovies;
    } catch (error) {
        throw new AppError(error.message || 'Error getting all movies', 500);
    }
}

export async function findByTitleService(title, page, limit) {
    try {
        const movies = await findByTitle(title, page, limit);

        if (!movies || movies.length === 0) {
            return [];
        }

        const formattedMovies = movies.map(movie => {
            const movieObject = movie.toObject(); 
            
            if (movieObject && movieObject._id !== undefined) {
                const { _id, ...rest } = movieObject;
                return { ...rest, id: _id };
            }
            return movieObject;
        });

        return formattedMovies;
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

export async function findByDirectorService(director) {
    try {
        return await findByDirector(director);
    } catch (error) {
        throw new AppError(error.message || 'Error getting movie by director', 500);
    }
}

export async function findByYearService(year) {
    try {
        return await findByYear(year);
    } catch (error) {
        throw new AppError(error.message || 'Error getting movie by year', 500);
    }
}