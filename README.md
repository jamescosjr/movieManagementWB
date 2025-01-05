Movie Management API

This is a Node.js-based API for managing a collection of movies. It provides functionality to create, read, update, and delete movies, along with filtering by specific properties such as title, genre, director, and release year.

Features
Add new movies to the collection.
Retrieve all movies or filter them by specific attributes.
Update or delete existing movies.
Organized endpoints to efficiently manage movie data.
Installation
Clone the repository:

git clone <repository-url>
cd movie-management-api
Install dependencies:

npm install
Set up the environment:

Create a .env file in the root of the project and configure your database and application settings.
Example .env:

env
PORT=3000
MONGO_URI=mongodb://localhost:27017/moviesDB
Start the server:

npm start
API Endpoints
1. Add a Movie
POST /movies
Description: Adds a new movie to the database.
Request Body:
json
{
  "title": "Inception",
  "director": "Christopher Nolan",
  "genre": "Sci-Fi",
  "year": 2010
}
Response:
201 Created on success.
400 Bad Request for validation errors.
2. Get All Movies
GET /movies
Description: Retrieves all movies in the collection.
Response:
200 OK with an array of movies.
3. Find Movie by Title
GET /movies/:title
Description: Retrieves a movie by its title.
Response:
200 OK with the movie details.
404 Not Found if the movie does not exist.
4. List Movies by Genre
GET /movies/genre/:genre
Description: Lists all movies that belong to a specific genre.
Response:
200 OK with an array of movies.
404 Not Found if no movies match the genre.
5. List Movies by Director
GET /movies/director/:director
Description: Lists all movies directed by a specific director.
Response:
200 OK with an array of movies.
404 Not Found if no movies match the director.
6. List Movies by Year
GET /movies/year/:year
Description: Lists all movies released in a specific year.
Response:
200 OK with an array of movies.
404 Not Found if no movies match the year.
7. Delete a Movie
DELETE /movies/:id
Description: Deletes a movie by its ID.
Response:
200 OK on successful deletion.
404 Not Found if the movie does not exist.
8. Update a Movie
PUT /movies/:id
Description: Updates the details of a movie by its ID.
Request Body:
json
Copiar código
{
  "title": "Inception",
  "director": "Christopher Nolan",
  "genre": "Sci-Fi",
  "year": 2010
}
Response:
200 OK on successful update.
400 Bad Request for validation errors.
404 Not Found if the movie does not exist.
Error Handling
The API uses structured error handling to return meaningful error messages.
Common response formats for errors:
Validation Error: 400 Bad Request with a descriptive message.
Not Found: 404 Not Found if a resource does not exist.
Server Error: 500 Internal Server Error for unexpected issues.
Technologies Used
Node.js
Express.js
MongoDB (with Mongoose)
Jest for testing (optional)
Future Enhancements
Add authentication and authorization for secure access.
Implement pagination for listing endpoints.
Add advanced search and filtering capabilities.
