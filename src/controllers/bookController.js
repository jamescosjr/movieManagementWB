import { createBook, listBooks, findBookByTitle, deleteBookById, updateBookById } from '../service/bookService.js';

export function createBookHandler(data) {
    try {
        const book = createBook(data);
        console.log('Book created successfully:', book);
    } catch (error) {
        console.error('Error creating book:', error.message);
    }
};

export function listBooksHandler() {
    const books = listBooks();
    console.log('Books:', books);
};

export function findBookByTitleHandler(title) {
    const book = findBookByTitle(title);
    if (!book) {
        console.log('Book not found');
        return;
    }
    console.log('Book found:', book);
};

export function deleteBookHandler(id) {
    try {
        const deletedBook = deleteBookById(id);
        if (!deletedBook) {
            console.log('Book not found, nothing to delete.');
            return;
        }
        console.log('Book deleted successfully:', deletedBook);
    } catch (error) {
        console.error('Error deleting book:', error.message);
    }
};

export function updateBookHandler(id, data) {
    try {
        const updatedBook = updateBookById(id, data);
        if (!updatedBook) {
            console.log('Book not found, nothing to update.');
            return;
        }
        console.log('Book updated successfully:', updatedBook);
    } catch (error) {
        console.error('Error updating book:', error.message);
    }
};