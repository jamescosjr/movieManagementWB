import {
  register,
  findAll,
  findByTitle,
  listByGenre,
  listByDirector,
  listByYear,
  deleteById,
  movies,
  updateById,
} from "../repository/movieRepository.js";
import { validateMovie } from "../utils/validation.js";

export async function registerMovieHandler(req, res) {
    const movie = req.body;
    const isValid = validateMovie(movie);

    if (!isValid) {
        return res.status(400).json({ message: 'Invalid movie data' });
    }

  try {
    const newMovie = await register(movie);
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
}

export function listMoviesHandler(req, res) {
  try {
    const movies = findAll();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
 
}

export function findMovieByTitleHandler(req, res) {
  const title = req.params.title;
  
  try {
      const movie = findByTitle(title);
      
      if (!movie) {
          return res.status(404).json({ message: "Movie not found" });
      }
      
      res.status(200).json(movie);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}


export function listMoviesbyGenreHandler(req, res) {
  const genre = req.params.genre;

  try {
      const movies = listByGenre(genre);
      
      if (movies.length === 0) {
          return res.status(404).json({ message: 'Genre not found' });
      }

      res.status(200).json(movies);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

export function listMoviesByDirectorHandler(req, res) {
  const director = req.params.director;

  try {
      const movies = listByDirector(director);

      if (movies.length === 0) {
          return res.status(404).json({ message: 'Director not found' });
      }

      res.status(200).json(movies);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

export function listMoviesByYearHandler(req, res) {
  const year = parseInt(req.params.year);

  try {
      const movies = listByYear(year);

      if (movies.length === 0) {
          return res.status(404).json({ message: 'Year not found' });
      }

      res.status(200).json(movies);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

export function deleteMovieHandler(req, res) {
  const id = req.params.id;

  try {
      const deletedMovie = deleteById(id);

      if (!deletedMovie) {
          return res.status(404).json({ message: 'Movie not found' });
      }

      res.status(204).send();
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}


export function updateMovieHandler(req, res) {
    try {
        const updatedMovie = updateById(req.params.id, req.body);
        if (!updatedMovie) {
          return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json(updatedMovie);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}
