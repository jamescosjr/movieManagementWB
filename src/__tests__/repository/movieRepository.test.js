/* eslint-disable no-undef */
import {
    register,
    findAll,
    findByTitle,
    deleteById,
    updateById,
    listByDirector,
    listByGenre,
    listByYear,
    movies,
 } from '../../repository/movieRepository.js';
import { generateId } from '../../utils/generateId.js';

jest.mock('../../utils/generateId.js');
const mockGenerateId = generateId;

describe('Movie Repository', () => {
    beforeEach(() => {
        movies.length = 0; 
        mockGenerateId.mockClear(); 
    });

    it('should register a new movie with a unique id', () => {
        const id = generateId();
        const movieData = { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' };
        const registeredMovie = register(movieData);

        expect(registeredMovie).toMatchObject(movieData);
        expect(typeof registeredMovie.id).toEqual(expect.any(String));
        expect(findAll()).toContainEqual(registeredMovie);
        expect(id).toBe(registeredMovie.id);
    });

    it('should find all movies', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        const movie1 = register({ title: 'Title 1', director: 'director 1', year: 2021, genre: 'genre 1' });
        const movie2 = register({ title: 'Title 2', director: 'director 2', year: 2022, genre: 'genre 2' });

        const allMovies = findAll();

        expect(allMovies).toEqual([movie1, movie2]);
    });

    it('should find a movie by title', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const movie = register({ title: 'Unique Title', director: 'Unique director', year: 2022, genre: 'Unique Genre' });
        const foundMovie = findByTitle('Unique Title');

        expect(foundMovie).toEqual(movie);
    });

    it('should return undefined when finding a movie by a non-existing title', () => {
        const foundMovie = findByTitle('Non-existing Title');

        expect(foundMovie).toBeUndefined();
    });

    it('should list movies by genre', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const movie1 = register({ title: 'Title 1', director: 'director 1', year: 2021, genre: 'genre 1' });
        const movie2 = register({ title: 'Title 2', director: 'director 2', year: 2022, genre: 'genre 2' });

        const moviesByGenre = listByGenre('genre 1');
        const moviesByGenre2 = listByGenre('genre 2');

        expect(moviesByGenre2).toEqual([movie2]);
        expect(moviesByGenre).toEqual([movie1]);
    });

    it('should list movies by director', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const movie1 = register({ title: 'Title 1', director: 'director 1', year: 2021, genre: 'genre 1' });
        const movie2 = register({ title: 'Title 2', director: 'director 2', year: 2022, genre: 'genre 2' });

        const moviesByDirector = listByDirector('director 2');
        const moviesByDirector2 = listByDirector('director 1');

        expect(moviesByDirector).toEqual([movie2]);
        expect(moviesByDirector2).toEqual([movie1]);
    });

    it('should list movies by year', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const movie1 = register({ title: 'Title 1', director: 'director 1', year: 2021, genre: 'genre 1' });
        const movie2 = register({ title: 'Title 2', director: 'director 2', year: 2022, genre: 'genre 2' });

        const moviesByYear = listByYear(2021);
        const moviesByYear2 = listByYear(2022);

        expect(moviesByYear).toEqual([movie1]);
        expect(moviesByYear2).toEqual([movie2]);
    });

    it('should return an empty array when listing movies by a non-existing year', () => {
        const moviesByYear = listByYear(2021);

        expect(moviesByYear).toEqual([]);
    });

    it('should return an empty array when listing movies by a non-existing director', () => {
        const moviesByDirector = listByDirector('director');

        expect(moviesByDirector).toEqual([]);
    });

    it('should return an empty array when listing movies by a non-existing genre', () => {
        const moviesByGenre = listByGenre('genre');

        expect(moviesByGenre).toEqual([]);
    });

    it('should delete a movie by id', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const movie = register({ title: 'Title to Delete', director: 'director', year: 2022, genre: 'genre' });
        const deletedMovie = deleteById(movie.id);

        expect(deletedMovie).toEqual(movie);
        expect(findAll()).not.toContainEqual(movie);
    });

    it('should return null when deleting a movie by a non-existing id', () => {
        const deletedMovie = deleteById('non-existing-id');

        expect(deletedMovie).toBeNull();
    });

    it('should update a movie by id', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const movie = register({ title: 'Title to Update', director: 'director', year: 2022, genre: 'genre' });
        const updatedMovie = updateById(movie.id, { title: 'Updated Title' });

        expect(updatedMovie).toMatchObject({ ...movie, title: 'Updated Title' });
    });

    it('should return null when updating a movie by a non-existing id', () => {
        const updatedMovie = updateById('non-existing-id', { title: 'Updated Title' });

        expect(updatedMovie).toBeNull();
    });
});
