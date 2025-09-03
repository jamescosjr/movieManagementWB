import { Router } from "express";
import {
  registerMovieHandler,
  updateMovieHandler,
  deleteMovieHandler,
  getAllMoviesHandler,
  findMovieByTitleHandler,
  listMoviesbyGenreHandler,
  listMoviesbyDirectorHandler,
  listMoviesbyYearHandler,
  searchMoviesHandler,
} from "../movieController.js";

const router = Router();

router.post("/movies", registerMovieHandler);
router.get("/movies", getAllMoviesHandler);
router.get("/movies/:title", findMovieByTitleHandler);
router.get("/movies/genre/:genre", listMoviesbyGenreHandler);
router.get("/movies/director/:director", listMoviesbyDirectorHandler);
router.get("/movies/year/:year", listMoviesbyYearHandler);
router.delete("/movies/:id", deleteMovieHandler);
router.put("/movies/:id", updateMovieHandler);
router.get("/search", searchMoviesHandler);

export default router;