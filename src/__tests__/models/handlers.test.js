/* eslint-disable no-undef */
import {
    registerMovieHandler,
    listMoviesHandler,
    findMovieByTitleHandler,
    listMoviesbyGenreHandler,
    listMoviesByDirectorHandler,
    listMoviesByYearHandler,
    deleteMovieHandler,
    updateMovieHandler 
 } from '../../controllers/movieController.js';
import * as movieService from '../../service/movieService.js';

const logSpy = jest.spyOn(console, 'log').mockImplementation();
const errorSpy = jest.spyOn(console, 'error').mockImplementation();

afterEach(() => {
    jest.clearAllMocks();
});

describe('Movie Handlers', () => {
    it('should log success message when registering a movie', () => {
        const mockMovie = { title: 'Test Title', director: 'Test Director', year: 2022, genre: 'Test Genre' };
        jest.spyOn(movieService, 'registerMovie').mockReturnValue(mockMovie);

        registerMovieHandler(mockMovie);

        expect(logSpy).toHaveBeenCalledWith('Movie registered successfully:', mockMovie);
    });   

    it('should log error message when registering a movie fails', () => {
        jest.spyOn(movieService, 'registerMovie').mockImplementation(() => {
            throw new Error('Creation Error');
        });

        registerMovieHandler({ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' });

        expect(errorSpy).toHaveBeenCalledWith('Error registering movie:', 'Creation Error');
    });

    it('should list all movies', () => {
        const mockMovies = [{ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' }];
        jest.spyOn(movieService, 'listMovies').mockReturnValue(mockMovies);
    
        listMoviesHandler();
    
        expect(logSpy).toHaveBeenCalledWith('Movies:', mockMovies);
    });

    it('should find a movie by title', () => {
        const mockMovie = { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' };
        jest.spyOn(movieService, 'findMovieByTitle').mockReturnValue(mockMovie);
    
        findMovieByTitleHandler('Test Title');
    
        expect(logSpy).toHaveBeenCalledWith('Movie found:', mockMovie);
    });
    
    it('should log not found message if movie is not found', () => {
        jest.spyOn(movieService, 'findMovieByTitle').mockReturnValue(null);
    
        findMovieByTitleHandler('Nonexistent Title');
    
        expect(logSpy).toHaveBeenCalledWith('Movie not found');
    });

    it('should list movies by genre', () => {
        const mockMovies = [{ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' }];
        jest.spyOn(movieService, 'listMoviesByGenre').mockReturnValue(mockMovies);  
    });

    it('should list movies by director', () => {
        const mockMovies = [{ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' }];
        jest.spyOn(movieService, 'listMoviesByDirector').mockReturnValue(mockMovies);
    });

    it('should list movies by year', () => {
        const mockMovies = [{ title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' }];
        jest.spyOn(movieService, 'listMoviesByYear').mockReturnValue(mockMovies);
    });

    it('should log error message when listing movies by genre fails', () => {
        jest.spyOn(movieService, 'listMoviesByGenre').mockImplementation(() => {
            throw new Error('Movie not found');
        });
    
        listMoviesbyGenreHandler('Test Genre');
    
        expect(errorSpy).toHaveBeenCalledWith('Error listing movies by genre:', 'Movie not found');
    });

    it('should log error message when listing movies by director fails', () => {
        jest.spyOn(movieService, 'listMoviesByDirector').mockImplementation(() => {
            throw new Error('Movie not found');
        });
    
        listMoviesByDirectorHandler('Test Director');
    
        expect(errorSpy).toHaveBeenCalledWith('Error listing movies by director:', 'Movie not found');
    });

    it('should log error message when listing movies by year fails', () => {
        jest.spyOn(movieService, 'listMoviesByYear').mockImplementation(() => {
            throw new Error('Movie not found');
        });
    
        listMoviesByYearHandler(2022);
    
        expect(errorSpy).toHaveBeenCalledWith('Error listing movies by year:', 'Movie not found');
    });
    
    it('should delete a movie by id', () => {
        const mockMovie = { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Teste Genre', id: 1 };
        jest.spyOn(movieService, 'deleteMovieById').mockReturnValue(mockMovie);

        deleteMovieHandler(1);

        expect(logSpy).toHaveBeenCalledWith('Movie deleted successfully:', mockMovie);
    });

    it('should log not found message if movie to delete is not found', () => {
        jest.spyOn(movieService, 'deleteMovieById').mockReturnValue(null);
    
        deleteMovieHandler(999);
    
        expect(logSpy).toHaveBeenCalledWith('Movie not found, nothing to delete.');
    });
    
    it('should log error message when deleting a movie fails', () => {
        jest.spyOn(movieService, 'deleteMovieById').mockImplementation(() => {
            throw new Error('Deletion Error');
        });
    
        deleteMovieHandler(1);
    
        expect(errorSpy).toHaveBeenCalledWith('Error deleting movie:', 'Deletion Error');
    });

    it('should update a movie by id', () => {
        const mockMovie = { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Teste Genre', id: 1 };
        jest.spyOn(movieService, 'updateMovieById').mockReturnValue(mockMovie);

        updateMovieHandler(1, mockMovie);

        expect(logSpy).toHaveBeenCalledWith('Movie updated successfully:', mockMovie);
    });

    it('should log not found message if movie to update is not found', () => {
        jest.spyOn(movieService, 'updateMovieById').mockReturnValue(null);
    
        updateMovieHandler(999, { title: 'Test Title', director: 'Test director', year: 2022, genre: 'Test Genre' });
    
        expect(logSpy).toHaveBeenCalledWith('Movie not found, nothing to update.');
    });
});
