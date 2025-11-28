import { Movie } from "../schema/movieSchema.js";

export async function getAllMovies(page, limit){
    const skip = (page - 1) * limit;

    const [movies, totalCount] = await Promise.all([
        Movie.find().skip(skip).limit(limit).sort({ title: 1 }).lean(),
        Movie.countDocuments()
    ]);

    return { movies, totalCount };
}

export async function findByTitle(title, page, limit) {
    const query = { title: new RegExp(title, "i") };
    const skip = (page - 1) * limit;

    const [movies, totalCount] = await Promise.all([
        Movie.find(query).skip(skip).limit(limit).lean(),
        Movie.countDocuments(query)
    ]);

    return { movies, totalCount };
}

export async function findByGenre(genre, page, limit) {
    const query = { genre: new RegExp(genre, "i") };
    const skip = (page - 1) * limit;

    const [movies, totalCount] = await Promise.all([
        Movie.find(query).skip(skip).limit(limit).lean(),
        Movie.countDocuments(query)
    ]); 

    return { movies, totalCount };
}    

export async function findByDirector(director, page, limit){
    const query = { director: new RegExp(director, "i") };
    const skip = (page - 1) * limit;

    const [movies, totalCount] = await Promise.all([
        Movie.find(query).skip(skip).limit(limit).lean(),
        Movie.countDocuments(query)
    ]);

    return { movies, totalCount };
}

export async function findByYear(year, page, limit){
    const query = { year }; 
    const skip = (page - 1) * limit;

    const [movies, totalCount] = await Promise.all([
        Movie.find(query).skip(skip).limit(limit).sort({ title: 1 }).lean(),
        Movie.countDocuments(query)
    ]);

    return { movies, totalCount };
}