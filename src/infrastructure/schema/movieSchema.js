import mongoose from "mongoose";

export const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
})

export const Movie = mongoose.model("Movie", movieSchema);