import { Movie } from "../schema/movieSchema.js";

export async function getAllMovies(page, limit){
    try {
        const skip = (page - 1) * limit;
        return Movie.find().skip(skip).limit(limit);
    } catch (error) {
        throw error; 
    }
}

export async function findByTitle(title){
    try{
        return Movie.find({ title })
    } catch (error) {
        next(error);
    }
}

export async function findByGenre(genre){
    try{
        return Movie.find({ genre })
    } catch (error) {
        next(error);
    }
}

export async function findByDirector(director){
    try{
        return Movie.find({ director })
    } catch (error) {
        next(error);
    }
}

export async function findByYear(year){
    try{
        return Movie.find({ year })
    } catch (error) {
        next(error);
    }
}