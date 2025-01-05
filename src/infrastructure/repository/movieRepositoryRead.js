import { Movie } from "../schema/movieSchema";

export async function getAllMovies(){
    try {
        return Movie.find();
    } catch (error) {
        next(error);
    }
}

export async function findByTitle(title){
    try{
        return Movie.find({ title })
    } catch (error) {
        next(error);
    }
}