function validateMovieData({ title, director, year, genre }) {
    if (!title || typeof title !== 'string') {
        throw new Error('Invalid title');
    }
    if (!director || typeof director !== 'string') {
        throw new Error('Invalid director');
    }
    if (!year || typeof year !== 'number' || year < 0) {
        throw new Error('Invalid year');
    }
    if (!genre || typeof genre !== 'string') {
        throw new Error('Invalid genre');
    }
};

export function registerMovieModel({ title, director, year, genre }) {
    validateMovieData({ title, director, year, genre });
    return { title, director, year, genre, id: null };
};