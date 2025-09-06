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
    findByYear,
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
        const { movies, totalCount } = await findByTitle(title, page, limit);

        if (!movies || movies.length === 0) {
            return {
                data: [],
                currentPage: page,
                totalCount: 0,
                totalPages: 0
            };
        }

        const formattedMovies = movies.map(movie => {
            const { _id, ...rest } = movie;
            return { ...rest, id: _id };
        });

        return {
            data: formattedMovies,
            currentPage: page,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        };
    } catch (error) {
        throw new AppError(error.message || 'Error getting movie by title', 500);
    }
}

export async function findByGenreService(genre, page, limit) {
    try {
        const { movies, totalCount } = await findByGenre(genre, page, limit);

        if (!movies || movies.length === 0) {
            return {
                data: [],
                currentPage: page,
                totalCount: 0,
                totalPages: 0
            };
        }

        const formattedMovies = movies.map(movie => {
            const { _id, ...rest } = movie;
            return { ...rest, id: _id };
        });

        return {
            data: formattedMovies,
            currentPage: page,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        };
    } catch (error) {
        throw new AppError(error.message || 'Error getting movie by genre', 500);
    }
}

export async function findByDirectorService(director, page, limit) {
    try {
        const { movies, totalCount } = await findByDirector(director, page, limit);

        if (!movies || movies.length === 0) {
            return {
                data: [],
                currentPage: page,
                totalCount: 0,
                totalPages: 0
            };
        }

        const formattedMovies = movies.map(movie => {
            const { _id, ...rest } = movie;
            return { ...rest, id: _id };
        });

        return {
            data: formattedMovies,
            currentPage: page,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        };
    } catch (error) {
        throw new AppError(error.message || 'Error getting movie by director', 500);
    }
}

export async function findByYearService(year, page, limit) {
    try {
        const movies = await findByYear(year, page, limit);
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
        throw new AppError(error.message || 'Error getting movie by year', 500);
    }
}

export async function searchMoviesService({ searchType, searchTerm, page, limit }) {
    try {
        let movies;

        switch (true) {
            case Boolean(searchType == "title"):
                const title = searchTerm;
                movies = await findByTitleService(title, page, limit);
                break;
            case Boolean(searchType == "director"):
                const director = searchTerm;
                movies = await findByDirectorService(director, page, limit);
                break;
            case Boolean(searchType == "genre"):
                const genre = searchTerm;
                movies = await findByGenreService(genre, page, limit);
                break;
            case Boolean(searchType == "year"):
                const year = searchTerm;
                movies = await findByYearService(year, page, limit);
                break;
            default:
                movies = await getAllMoviesService(page, limit);
        }

        if (!movies || movies.length === 0) {
            return [];
        }

        return movies;
    } catch (error) {
        throw new AppError(error.message || 'Error searching movies', 500);
    }
}