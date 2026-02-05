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
        if (isNaN(page) || page < 1) {
            page = 0;
        }
        if (isNaN(limit) || limit < 1) {
            limit = 10;
        }

        let result;

        switch (searchType) {
            case 'title':
                result = await findByTitleService(searchTerm, page, limit);
                break;
            case 'director':
                result = await findByDirectorService(searchTerm, page, limit);
                break;
            case 'genre':
                result = await findByGenreService(searchTerm, page, limit);
                break;
            case 'year':
                result = await findByYearService(parseInt(searchTerm, 10), page, limit);
                break;
            default:
                result = await getAllMoviesService(page, limit);
        }

        return result;
    } catch (error) {
        throw new AppError(error.message || 'Error searching movies', 500);
    }
}
