import { generateId } from '../utils/generateId.js';


export let movies = [];

export function register(movie) {
    const id = generateId();
    const newMovie = { ...movie, id };
    movies.push(newMovie);
    return newMovie;
};

export function findAll() { return movies };

export function findByTitle(title){ return movies.find(movie => movie.title === title) };

export function listByGenre(genre) { return movies.filter(movie => movie.genre === genre) };

export function listByDirector(director) { return movies.filter(movie => movie.director === director) };

export function listByYear(year) { return movies.filter(movie => movie.year === year) };

export function deleteById(id) {
    const index = movies.findIndex(movie => movie.id === id);
    if (index !== -1) {
        return movies.splice(index, 1)[0];
    }
    return null;
};

export function updateById(id, data) {
    const index = movies.findIndex(movie => movie.id === id);
    if (index !== -1) {
        movies[index] = { ...movies[index], ...data };
        return movies[index];
    }
    return null;
}