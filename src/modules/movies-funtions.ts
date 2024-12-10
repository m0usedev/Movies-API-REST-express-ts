import path from "path";
import crypto from "node:crypto";

import { FileJson } from "./file-json";
import { zMovie } from "./zod-movies";

import {
  Movie,
  MovieModify,
  MovieQuery,
  TypeValuesMovieQuery,
} from "./interfaces";
import { MovieError } from "@/error/movies-error";

const FJ = new FileJson(
  path.join(__dirname, "..", "..", "data", "movies.json"),
);

export async function getAllMovies(
  filters?: MovieQuery,
): Promise<Movie[] | null> {
  const movies = (await FJ.read()) as Movie[];
  if (filters) {
    const filterKeys = Object.keys(filters);
    if (filterKeys.length === 0) return movies;
    return movies.filter((movie) => {
      let isMatch = true;
      filterKeys.forEach((key) => {
        const keyMovie = key as keyof Movie; // Aseguramos el tipo aquí
        const keyFilter = key as keyof MovieQuery; // Aseguramos el tipo aquí
        const compationBool = comparation(movie[keyMovie], filters[keyFilter]);
        if (!compationBool) isMatch = false;
      });
      return isMatch;
    });
  }
  return movies;
}

/**
 * Función para encontrar una pelicula por el id
 * @param {string} id Es el id de la pelicula que buscas
 * @returns {Movie | number | null} Si se encuentra la pelicula devuelve Movie, si no hay peliculas devuelve "0", si no encuentra la pelicula devuelve "null"
 */
export async function getOneMovie(id: string): Promise<Movie | number | null> {
  const movies = (await FJ.read()) as Movie[];
  if (!movies) return 0;
  const movie = movies.find((movie) => movie.id === id);
  if (!movie) return null;
  return movie;
}

export async function addMovie(movie: Movie): Promise<boolean> {
  movie.id = crypto.randomUUID();
  movie = zMovie.parse(movie);
  const movies = (await FJ.read()) as Movie[];
  const findMovie = movies.find((mov) => mov.id === movie.id);
  if (findMovie) return false;
  movies.push(movie);
  const result = FJ.write(movies);
  return result;
}

export async function delMovie(id: string): Promise<Movie | null> {
  const movies = (await FJ.read()) as Movie[];
  const delMovie = movies.find((mov, index) => {
    if (mov.id === id) {
      movies.splice(index, 1);
      return true;
    }
    return false;
  });
  if (delMovie) {
    await FJ.write(movies);
    return delMovie;
  }
  return null;
}

export async function modifyMovie(movieM: MovieModify): Promise<Movie> {
  if (!movieM.id)
    throw new MovieError(`No has mandado el id de la pelicula a modificar`);
  const movies = await getAllMovies();
  if (!movies) throw new MovieError(`No hay peliculas que modificar`);
  console.log(`movieM: ${JSON.stringify(movieM)}`);
  const movieIndex = movies.findIndex((m) => m.id === movieM.id);
  if (movieIndex < 0)
    throw new MovieError(`No hay ninguna pelicula con el id ${movieM.id}`);
  movies[movieIndex] = {
    ...movies[movieIndex],
    ...movieM,
  };
  await FJ.write(movies);
  return movies[movieIndex];
}

function comparation(
  original: TypeValuesMovieQuery,
  query: TypeValuesMovieQuery,
): boolean {
  if (original && query) {
    if (Array.isArray(original) && typeof query === "string") {
      const arrayQ = query.toLocaleLowerCase().split(",");
      original = original.map((v) => v.toLocaleLowerCase());
      if (original.length >= arrayQ.length) {
        return arrayQ.every((value) => {
          if (Array.isArray(original)) {
            return original.includes(value);
          }
          return null;
        });
      }
    } else {
      if (typeof original !== "string")
        original = original.toString().toLocaleLowerCase();
      if (typeof query !== "string")
        query = query.toString().toLocaleLowerCase();
      if (original === query) return true;
    }
  }
  return false;
}
