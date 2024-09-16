import promptSync from 'prompt-sync';
import { 
    registerMovie, 
    findMovieByTitle, 
    listMovies, 
    listMoviesByDirector, 
    listMoviesByGenre, 
    listMoviesByYear, 
    updateMovie, 
    deleteMovie 
} from './menuActions.js';

const prompt = promptSync({ sigint: true });

export function showMenu() {
    console.log('1. Register Movie');
    console.log('2. List Movies');
    console.log('3. Find Movie by Title');
    console.log('4. List Movies by Genre');
    console.log('5. List Movies by Director');
    console.log('6. List Movies by Year');
    console.log('7. Delete Movie');
    console.log('8. Update Movie');
    console.log('0. Exit');
};

export function handleMenuOption(option) {
    switch (option) {
        case 1:
            registerMovie();
            break;
        case 2:
            listMovies();
            break;
        case 3:
            findMovieByTitle();
            break;
        case 4:
            listMoviesByGenre();
            break;
        case 5:
            listMoviesByDirector();
            break;
        case 6:
            listMoviesByYear();
            break;
        case 7:
            deleteMovie();
            break;
        case 8:
            updateMovie();
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