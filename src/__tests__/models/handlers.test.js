import { createBookHandler, listBooksHandler, findBookByTitleHandler, deleteBookHandler, updateBookHandler } from '../../controllers/bookController.js';
import * as bookService from '../../service/bookService.js';

const logSpy = jest.spyOn(console, 'log').mockImplementation();
const errorSpy = jest.spyOn(console, 'error').mockImplementation();

afterEach(() => {
    jest.clearAllMocks();
});

describe('Book Handlers', () => {
    it('should log success message when creating a book', () => {
        const mockBook = { title: 'Test Title', author: 'Test Author', year: 2022 };
        jest.spyOn(bookService, 'createBook').mockReturnValue(mockBook);

        createBookHandler(mockBook);

        expect(logSpy).toHaveBeenCalledWith('Book created successfully:', mockBook);
    });   

    it('should log error message when creating a book fails', () => {
        jest.spyOn(bookService, 'createBook').mockImplementation(() => {
            throw new Error('Creation Error');
        });

        createBookHandler({ title: 'Test Title', author: 'Test Author', year: 2022 });

        expect(errorSpy).toHaveBeenCalledWith('Error creating book:', 'Creation Error');
    });

    it('should list all books', () => {
        const mockBooks = [{ title: 'Test Title', author: 'Test Author', year: 2022 }];
        jest.spyOn(bookService, 'listBooks').mockReturnValue(mockBooks);
    
        listBooksHandler();
    
        expect(logSpy).toHaveBeenCalledWith('Books:', mockBooks);
    });

    it('should find a book by title', () => {
        const mockBook = { title: 'Test Title', author: 'Test Author', year: 2022 };
        jest.spyOn(bookService, 'findBookByTitle').mockReturnValue(mockBook);
    
        findBookByTitleHandler('Test Title');
    
        expect(logSpy).toHaveBeenCalledWith('Book found:', mockBook);
    });
    
    it('should log not found message if book is not found', () => {
        jest.spyOn(bookService, 'findBookByTitle').mockReturnValue(null);
    
        findBookByTitleHandler('Nonexistent Title');
    
        expect(logSpy).toHaveBeenCalledWith('Book not found');
    });
    
    it('should delete a book by id', () => {
        const mockBook = { title: 'Test Title', author: 'Test Author', year: 2022, id: 1 };
        jest.spyOn(bookService, 'deleteBookById').mockReturnValue(mockBook);

        deleteBookHandler(1);

        expect(logSpy).toHaveBeenCalledWith('Book deleted successfully:', mockBook);
    });

    it('should log not found message if book to delete is not found', () => {
        jest.spyOn(bookService, 'deleteBookById').mockReturnValue(null);
    
        deleteBookHandler(999);
    
        expect(logSpy).toHaveBeenCalledWith('Book not found, nothing to delete.');
    });
    
    it('should log error message when deleting a book fails', () => {
        jest.spyOn(bookService, 'deleteBookById').mockImplementation(() => {
            throw new Error('Deletion Error');
        });
    
        deleteBookHandler(1);
    
        expect(errorSpy).toHaveBeenCalledWith('Error deleting book:', 'Deletion Error');
    });

    it('should update a book by id', () => {
        const mockBook = { title: 'Test Title', author: 'Test Author', year: 2022, id: 1 };
        jest.spyOn(bookService, 'updateBookById').mockReturnValue(mockBook);

        updateBookHandler(1, mockBook);

        expect(logSpy).toHaveBeenCalledWith('Book updated successfully:', mockBook);
    });

    it('should log not found message if book to update is not found', () => {
        jest.spyOn(bookService, 'updateBookById').mockReturnValue(null);
    
        updateBookHandler(999, { title: 'Test Title', author: 'Test Author', year: 2022 });
    
        expect(logSpy).toHaveBeenCalledWith('Book not found, nothing to update.');
    });
});
