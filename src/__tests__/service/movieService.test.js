import { registerMovie, listMovies, findMovieByTitle, deleteMovieById, updateMovieById, listMoviesByDirector, listMoviesByYear, listMoviesByGenre } from '../../service/movieService.js';
import * as movieRepository from '../../repository/movieRepository.js';

jest.mock('../../repository/movieRepository.js');

describe('Movie Service', () => {
    it('should register a movie', () => {
        const registeredMovie = { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre', id: null };
        jest.spyOn(movieRepository, 'register').mockReturnValue(registeredMovie);
    
        const result = registerMovie({ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' });
    
        expect(result).toEqual(registeredMovie);
        expect(movieRepository.register).toHaveBeenCalledWith({ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre', id: null });
    });

    it('should list all movies', () => {
        const mockMovies = [{ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' }];
        movieRepository.findAll.mockReturnValue(mockMovies);

        const result = listMovies();

        expect(result).toEqual(mockMovies);
        expect(movieRepository.findAll).toHaveBeenCalled();
    });

    it('should find a movie by title', () => {
        const mockMovie = { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' };
        movieRepository.findByTitle.mockReturnValue(mockMovie);

        const result = findMovieByTitle('Test Title');

        expect(result).toEqual(mockMovie);
        expect(movieRepository.findByTitle).toHaveBeenCalledWith('Test Title');
    });

    it('should list movies by genre', () => {
        const mockMovies = [{ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' }];
        movieRepository.listByGenre.mockReturnValue(mockMovies);

        const result = listMoviesByGenre('Test Genre');

        expect(result).toEqual(mockMovies);
        expect(movieRepository.listByGenre).toHaveBeenCalledWith('Test Genre');
    });

    it('should list movies by director', () => {
        const mockMovies = [{ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' }];
        movieRepository.listByDirector.mockReturnValue(mockMovies);

        const result = listMoviesByDirector('Test director');

        expect(result).toEqual(mockMovies);
        expect(movieRepository.listByDirector).toHaveBeenCalledWith('Test director');
    });

    it('should list movies by year', () => {
        const mockMovies = [{ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' }];
        movieRepository.listByYear.mockReturnValue(mockMovies);

        const result = listMoviesByYear(2022);

        expect(result).toEqual(mockMovies);
        expect(movieRepository.listByYear).toHaveBeenCalledWith(2022);
    });

    it('should return null if movie to delete is not found', () => {
        movieRepository.deleteById.mockReturnValue(null);

        const result = deleteMovieById('999');

        expect(result).toBeNull();
        expect(movieRepository.deleteById).toHaveBeenCalledWith('999');
    });

    it('should delete a movie by id', () => {
        const mockMovie = { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre', id: '123' };
        movieRepository.deleteById.mockReturnValue(mockMovie);

        const result = deleteMovieById('123');

        expect(result).toEqual(mockMovie);
        expect(movieRepository.deleteById).toHaveBeenCalledWith('123');
    });

    it('should return null if movie to update is not found', () => {
        movieRepository.updateById.mockReturnValue(null);

        const result = updateMovieById('999', { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' });

        expect(result).toBeNull();
        expect(movieRepository.updateById).toHaveBeenCalledWith('999', { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' });
    });

    it('should update a movie by id', () => {
        const mockMovie = { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre', id: '123' };
        movieRepository.updateById.mockReturnValue(mockMovie);

        const result = updateMovieById('123', { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' });

        expect(result).toEqual(mockMovie);
        expect(movieRepository.updateById).toHaveBeenCalledWith('123', { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' });
    });
});