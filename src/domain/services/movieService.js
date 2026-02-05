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
        const { movies, totalCount } = await getAllMovies(page, limit);

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
            return { ...rest, id: _id.toString() };
        });

        return {
            data: formattedMovies,
            currentPage: page,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        };
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
            return { ...rest, id: _id.toString() };
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
            return { ...rest, id: _id.toString() };
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
            return { ...rest, id: _id.toString() };
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
        const parsedYear = parseInt(year, 10);
        if (isNaN(parsedYear)) {
            return { data: [], currentPage: page, totalCount: 0, totalPages: 0 };
        }

        const { movies, totalCount } = await findByYear(parsedYear, page, limit);

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
            return { ...rest, id: _id.toString() };
        });

        return {
            data: formattedMovies,
            currentPage: page,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        };
    } catch (error) {
        throw new AppError(error.message || 'Error getting movie by year', 500);
    }
}

export async function searchMoviesService(searchType, searchTerm, page, limit) {
    try {
        if (searchType) searchType = String(searchType).trim().toLowerCase();
        if (searchTerm || searchTerm === 0) searchTerm = String(searchTerm).trim();

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        if (isNaN(page) || page < 0) {
            page = 0;
        }
        if (isNaN(limit) || limit < 1) {
            limit = 10;
        }

        const dbPage = page + 1;

        
        let result;

        switch (searchType) {
            case 'title': {
                const title = searchTerm;
                result = await findByTitleService(title, dbPage, limit);
                break;
            }
            case 'director': {
                const director = searchTerm;
                result = await findByDirectorService(director, dbPage, limit);
                break;
            }
            case 'genre': {
                const genre = searchTerm;
                result = await findByGenreService(genre, dbPage, limit);
                break;
            }
            case 'year': {
                console.warn('Searching by year with searchTerm:', searchTerm);
                const year = parseInt(searchTerm, 10);
                result = await findByYearService(year, dbPage, limit);
                break;
            }
            default:
                result = await getAllMoviesService(dbPage, limit);
        }

        return result;
    } catch (error) {
        throw new AppError(error.message || 'Error searching movies', 500);
    }
}
