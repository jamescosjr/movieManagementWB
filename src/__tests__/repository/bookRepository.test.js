import { create, findAll, findByTitle, deleteById, books, updateById } from '../../repository/bookRepository.js';
import { generateId } from '../../utils/generateId.js';

jest.mock('../../utils/generateId.js');
const mockGenerateId = generateId;

describe('Book Repository', () => {
    beforeEach(() => {
        books.length = 0; 
        mockGenerateId.mockClear(); 
    });

    it('should create a new book with a unique id', () => {
        const id = generateId();
        const bookData = { title: 'Test Title', author: 'Test Author', year: 2022 };
        const createdBook = create(bookData);

        expect(createdBook).toMatchObject(bookData);
        expect(typeof createdBook.id).toEqual(expect.any(String));
        expect(findAll()).toContainEqual(createdBook);
    });

    it('should find all books', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        const book1 = create({ title: 'Title 1', author: 'Author 1', year: 2021 });
        const book2 = create({ title: 'Title 2', author: 'Author 2', year: 2022 });

        const allBooks = findAll();
        expect(allBooks).toEqual([book1, book2]);
    });

    it('should find a book by title', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const book = create({ title: 'Unique Title', author: 'Unique Author', year: 2022 });
        const foundBook = findByTitle('Unique Title');

        expect(foundBook).toEqual(book);
    });

    it('should return undefined when finding a book by a non-existing title', () => {
        const foundBook = findByTitle('Non-existing Title');

        expect(foundBook).toBeUndefined();
    });

    it('should delete a book by id', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const book = create({ title: 'Title to Delete', author: 'Author', year: 2022 });
        const deletedBook = deleteById(book.id);

        expect(deletedBook).toEqual(book);
        expect(findAll()).not.toContainEqual(book);
    });

    it('should return null when deleting a book by a non-existing id', () => {
        const deletedBook = deleteById('non-existing-id');

        expect(deletedBook).toBeNull();
    });

    it('should update a book by id', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const book = create({ title: 'Title to Update', author: 'Author', year: 2022 });
        const updatedBook = updateById(book.id, { title: 'Updated Title' });

        expect(updatedBook).toMatchObject({ ...book, title: 'Updated Title' });
    });

    it('should return null when updating a book by a non-existing id', () => {
        const updatedBook = updateById('non-existing-id', { title: 'Updated Title' });

        expect(updatedBook).toBeNull();
    });
});
