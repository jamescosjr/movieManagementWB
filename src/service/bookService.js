import { createBookModel } from '../models/book.js';
import { create, findAll, findByTitle, deleteById, updateById } from '../repository/bookRepository.js';

export function createBook(data) {
    const book = createBookModel(data);
    return create(book);
};

export function listBooks() { return findAll() };

export function findBookByTitle(title) { return findByTitle(title) };

export function deleteBookById(id) { return deleteById(id) };

export function updateBookById(id, data) { return updateById(id, data) };