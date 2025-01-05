import { Movie } from "../schema/movieSchema";

export async function getAllMovies(){
    try {
        return Movie.find();
    } catch (error) {
        next(error);
    }
}