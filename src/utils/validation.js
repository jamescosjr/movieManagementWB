export function isValidString(str) { return typeof str === 'string' && str.trim() !== '' };

export function isValidYear(year) { return typeof year === 'number' && year > 0 };

export function validateMovie(movie) {
    if (!isValidString(movie.title)) {
        return false;
    }
    if (!isValidString(movie.director)) {
        return false;
    }
    if (!isValidString(movie.genre)) {
        return false;
    }
    if (!isValidYear(movie.year)) {
        return false;
    }
    return true;
}