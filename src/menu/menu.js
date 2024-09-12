import promptSync from 'prompt-sync';
import { createBook, listBooks, findBookByTitle, deleteBook, updateBook } from './menuActions.js';

const prompt = promptSync({ sigint: true });

export function showMenu() {
    console.log('1. Create Book');
    console.log('2. List Books');
    console.log('3. Find Book by Title');
    console.log('4. Delete Book');
    console.log('5. Update Book');
    console.log('0. Exit');
};

export function handleMenuOption(option) {
    switch (option) {
        case 1:
            createBook();
            break;
        case 2:
            listBooks();
            break;
        case 3:
            findBookByTitle();
            break;
        case 4:
            deleteBook();
            break;
        case 5:
            updateBook();
            break;
        case 0:
            console.log('Exiting...');
            process.exit();
        default:
            console.log('Invalid option, please try again.');
    }
};

export function menuLoop  ()  {
    while (true) {
        showMenu();
        const option = parseInt(prompt('Select an option: '), 10);
        handleMenuOption(option);
    }
};