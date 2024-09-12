import promptSync from 'prompt-sync';
import { createBookHandler, listBooksHandler, findBookByTitleHandler, deleteBookHandler, updateBookHandler } from '../controllers/bookController.js';


const prompt = promptSync({ sigint: true });

export function createBook() {
    const title = prompt('Enter the book title: ');
    const author = prompt('Enter the book author: ');
    const year = parseInt(prompt('Enter the book year: '), 10);

    createBookHandler({ title, author, year });
};

export function listBooks() {
    listBooksHandler();
};

export function findBookByTitle() {
    const title = prompt('Enter the book title to search: ');
    findBookByTitleHandler(title);
};

export function deleteBook() {
    const id = prompt('Enter the book ID to delete: ');
    deleteBookHandler(id);
};

export function updateBook() {
    const id = prompt('Enter the book ID to update: ');
    const title = prompt('Enter the book title: ');
    const author = prompt('Enter the book author: ');
    const year = parseInt(prompt('Enter the book year: '), 10);

    const updatedBook = {};

    if (title) updatedBook.title = title;
    if (author) updatedBook.author = author;
    if (year) updatedBook.year = year;

    updateBookHandler(id, updatedBook);
}