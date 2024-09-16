import promptSync from 'prompt-sync';
import { 
    registerMovieHandler,
    listMoviesHandler,
    findMovieByTitleHandler,
    listMoviesbyGenreHandler,
    listMoviesByDirectorHandler, 
    listMoviesByYearHandler,
    deleteMovieHandler,
    updateMovieHandler 
} from '../controllers/movieController.js';


const prompt = promptSync({ sigint: true });

export function registerMovie() {
    const title = prompt('Enter the movie title: ');
    const director = prompt('Enter the movie director: ');
    const year = parseInt(prompt('Enter the movie year: '), 10);
    const genre = prompt('Enter the movie genre: ');

    registerMovieHandler({ title, director, year, genre });
};

export function listMovies() {
    listMoviesHandler();
};

export function findMovieByTitle() {
    const title = prompt('Enter the movie title to search: ');
    findMovieByTitleHandler(title);
};

export function listMoviesByGenre() {
    const genre = prompt('Enter the genre to search: ');
    listMoviesbyGenreHandler(genre);
}

export function listMoviesByDirector() {
    const director = prompt('Enter the director to search: ');
    listMoviesByDirectorHandler(director);
}

export function listMoviesByYear() {
    const year = parseInt(prompt('Enter the year to search: '), 10);
    listMoviesByYearHandler(year);
}

export function deleteMovie() {
    const id = prompt('Enter the movie ID to delete: ');
    deleteMovieHandler(id);
};

export function updateMovie() {
    const id = prompt('Enter the movie ID to update: ');
    const title = prompt('Enter the movie title: ');
    const director = prompt('Enter the movie director: ');
    const year = parseInt(prompt('Enter the movie year: '), 10);
    const genre = prompt('Enter the movie genre: ');

    const updatedMovie = {};

    if (title) updatedMovie.title = title;
    if (director) updatedMovie.director = director;
    if (year) updatedMovie.year = year;
    if (genre) updatedMovie.genre = genre;

    updateMovieHandler(id, updatedMovie);
}