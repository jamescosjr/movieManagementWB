import { registerMovieModel } from '../models/movie.js';
import { register, findAll, findByTitle, listByDirector, listByGenre, listByYear, deleteById, updateById } from '../repository/movieRepository.js';

export function registerMovie(data) {
    const movie = registerMovieModel(data);
    return register(movie);
};

export function listMovies() { return findAll() };

export function findMovieByTitle(title) { return findByTitle(title) };

export function listMoviesByGenre(genre) { return listByGenre(genre) };

export function listMoviesByDirector(director) { return listByDirector(director) };

export function listMoviesByYear(year) { return listByYear(year) };

export function deleteMovieById(id) { return deleteById(id) };

export function updateMovieById(id, data) { return updateById(id, data) };