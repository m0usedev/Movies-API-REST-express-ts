import express from "express";
import { MovieControler } from "./modules/movies-controler";

const method = express.Router();
const movieControler = new MovieControler();

method.get("/movies/:id", movieControler.getOneMovie.bind(movieControler));
method.get("/movies", movieControler.getAllMovies.bind(movieControler));
method.post("/movies", movieControler.addMovie.bind(movieControler));
method.delete("/movies/:id", movieControler.delMovie.bind(movieControler));
method.patch("/movies/:id", movieControler.modifyMovie.bind(movieControler));

export { method };
