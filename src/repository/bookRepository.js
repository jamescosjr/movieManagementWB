import { generateId } from '../utils/generateId.js';


export let books = [];

export function create(book) {
    const id = generateId();
    const newBook = { ...book, id };
    books.push(newBook);
    return newBook;
};

export function findAll() { return books };

export function findByTitle(title){ return books.find(book => book.title === title) };

export function deleteById(id) {
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        return books.splice(index, 1)[0];
    }
    return null;
};

export function updateById(id, data) {
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        books[index] = { ...books[index], ...data };
        return books[index];
    }
    return null;
}