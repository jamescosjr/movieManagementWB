export function validMovieData(title, director,genre, year) {
    if (typeof title !== 'string' || title.trim() === '') {
        return { valid: false, message: 'The title should be a valid string' };
    }
    if (typeof director !== 'string' || director.trim() === '') {
        return { valid: false, message: 'The director should be a valid string' };
    }
    if (typeof genre !== 'string' || genre.trim() === '') {
        return { valid: false, message: 'The genre should be a valid string' };
    }
    if (typeof year !== 'number' || year < 1000 || year > new Date().getFullYear()) {
        return { valid: false, message: 'The year should be a valid number' };
    }
    return { valid: true };
}