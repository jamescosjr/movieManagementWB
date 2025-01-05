import { Router } from "express";
import {
  registerMovieHandler,
  listMoviesHandler,
  findMovieByTitleHandler,
  listMoviesbyGenreHandler,
  listMoviesByDirectorHandler,
  listMoviesByYearHandler,
  deleteMovieHandler,
  updateMovieHandler,
} from "../controllers/movieController.js";

const router = Router();

router.post("/movies", registerMovieHandler);
router.get("/movies", listMoviesHandler);
router.get("/movies/:title", findMovieByTitleHandler);
router.get("/movies/genre/:genre", listMoviesbyGenreHandler);
router.get("/movies/director/:director", listMoviesByDirectorHandler);
router.get("/movies/year/:year", listMoviesByYearHandler);
router.delete("/movies/:id", deleteMovieHandler);
router.put("/movies/:id", updateMovieHandler);

export default router;