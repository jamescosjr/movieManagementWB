import { registerMovie, listMovies, findMovieByTitle, listMoviesByDirector, listMoviesByGenre, listMoviesByYear, deleteMovieById, updateMovieById } from '../service/movieService.js';

export function registerMovieHandler(data) {
    try {
        const movie = registerMovie(data);
        console.log('Movie registered successfully:', movie);
    } catch (error) {
        console.error('Error registering movie:', error.message);
    }
};

export function listMoviesHandler() {
    const movies = listMovies();
    console.log('Movies:', movies);
};

export function findMovieByTitleHandler(title) {
    const movie = findMovieByTitle(title);
    if (!movie) {
        console.log('Movie not found');
        return;
    }
    console.log('Movie found:', movie);
};

export function listMoviesbyGenreHandler(genre) {
    try {
        const movies = listMoviesByGenre(genre);
        console.log('Movies found:', movies);
    } catch (error) {
        console.error('Error listing movies by genre:', error.message);
    }
}

export function listMoviesByDirectorHandler(director) {
    try {
        const movies = listMoviesByDirector(director);
        console.log('Movies found:', movies);
    } catch (error) {
        console.error('Error listing movies by director:', error.message);
    }
}

export function listMoviesByYearHandler(year) {
    try {
        const movies = listMoviesByYear(year);
        console.log('Movies found:', movies);
    } catch (error) {
        console.error('Error listing movies by year:', error.message);
    }
}

export function deleteMovieHandler(id) {
    try {
        const deletedMovie = deleteMovieById(id);
        if (!deletedMovie) {
            console.log('Movie not found, nothing to delete.');
            return;
        }
        console.log('Movie deleted successfully:', deletedMovie);
    } catch (error) {
        console.error('Error deleting movie:', error.message);
    }
};

export function updateMovieHandler(id, data) {
    try {
        const updatedMovie = updateMovieById(id, data);
        if (!updatedMovie) {
            console.log('Movie not found, nothing to update.');
            return;
        }
        console.log('Movie updated successfully:', updatedMovie);
    } catch (error) {
        console.error('Error updating movie:', error.message);
    }
};