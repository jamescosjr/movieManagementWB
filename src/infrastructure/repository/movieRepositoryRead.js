import { Movie } from "../schema/movieSchema.js";

export async function getAllMovies(page, limit){
    try {
        let skip = (page - 1) * limit;
        if (skip < 0) {
            skip = 0;
        }

        const [movies, totalCount] = await Promise.all([
            Movie.find().skip(skip).limit(limit).sort({ title: 1 }).lean(),
            Movie.countDocuments()
        ]);

        return { movies, totalCount };

    } catch (error) {
        throw error; 
    }
}

export async function findByTitle(title, page, limit) {
    const query = { title: new RegExp(title, "i") };
    let skip = (page - 1) * limit;
        if (skip < 0) {
            skip = 0;
        }

    const [movies, totalCount] = await Promise.all([
        Movie.find(query).skip(skip).limit(limit).lean(),
        Movie.countDocuments(query)
    ]);

    return { movies, totalCount };
}

export async function findByGenre(genre, page, limit) {
    const query = { genre: new RegExp(genre, "i") };
    let skip = (page - 1) * limit;
        if (skip < 0) {
            skip = 0;
        }

    const [movies, totalCount] = await Promise.all([
        Movie.find(query).skip(skip).limit(limit).lean(),
        Movie.countDocuments(query)
    ]); 

    return { movies, totalCount };
}    

export async function findByDirector(director, page, limit){
    try{
        const query = { director: new RegExp(director, "i") };
        let skip = (page - 1) * limit;
        if (skip < 0) {
            skip = 0;
        }

        const [movies, totalCount] = await Promise.all([
            Movie.find(query).skip(skip).limit(limit).lean(),
            Movie.countDocuments(query)
        ]);

        return { movies, totalCount };
    } catch (error) {
        throw error;
    }
}

export async function findByYear(year, page, limit){
    try{
        const query = { year }; 
        let skip = (page - 1) * limit;
        if (skip < 0) {
            skip = 0;
        }

        const [movies, totalCount] = await Promise.all([
            Movie.find(query).skip(skip).limit(limit).sort({ title: 1 }).lean(),
            Movie.countDocuments(query)
        ]);

        return { movies, totalCount };
    } catch (error) {
        throw error;
    }
}