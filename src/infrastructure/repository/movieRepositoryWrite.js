import { Movie }from '../schema/movieSchema.js';
import { AppError } from '../../domain/error/customErros.js';

export async function createMovie({ title, director, genre, year }) {
    try {
        const newMovie = new Movie({
            title,
            director,
            genre,
            year,
        });
        return await newMovie.save();
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}

export async function updateById(id, { title, director, genre, year }) {
    try {
        return await Movie.findByIdAndUpdate(id, { title, director, genre, year }, { new: true });
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}

export async function deleteById(id){
    try {
        return await Movie.findByIdAndDelete(id, {lean: true});
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}