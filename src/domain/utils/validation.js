export function validMovieData(title, director,gender, year) {
    if (typeof title !== 'string' || title.trim() === '') {
        return { valid: false, message: 'The title should be a valid string' };
    }
    if (typeof director !== 'string' || director.trim() === '') {
        return { valid: false, message: 'The director should be a valid string' };
    }
    if (typeof gender !== 'string' || gender.trim() === '') {
        return { valid: false, message: 'The gender should be a valid string' };
    }
    if (typeof year !== 'number' || year < 2000 || year > new Date().getFullYear()) {
        return { valid: false, message: 'The year should be a valid number' };
    }
    return { valid: true };
}