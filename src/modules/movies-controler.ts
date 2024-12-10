import express from "express";

import { responseErrorHttp } from "./response-http";

import {
  addMovie,
  delMovie,
  getAllMovies,
  getOneMovie,
  modifyMovie,
} from "./movies-funtions";
import { Movie, MovieQuery } from "./interfaces";
import { zMovieModify } from "./zod-movies";

export class MovieControler {
  async getAllMovies(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    const filters: MovieQuery = req.query as object;
    getAllMovies(filters)
      .then((data) => {
        res.json(data).end();
      })
      .catch((error) => {
        responseErrorHttp(error, res);
      });
  }

  async getOneMovie(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    const { id } = req.params;
    getOneMovie(id)
      .then((data) => {
        if (data === 0)
          res
            .json({
              menssage: "No hay peliculas que ver.",
            })
            .end();
        if (!data)
          res
            .json({
              menssage: `No se encontro la pelicula con el id: ${id}`,
            })
            .end();
        res.json(data).end();
      })
      .catch((error) => {
        responseErrorHttp(error, res);
      });
  }

  async addMovie(req: express.Request, res: express.Response): Promise<void> {
    const movie = req.body as Movie;
    addMovie(movie)
      .then((data) => {
        if (data)
          res
            .json({
              menssage: `Se ñadio la pelicula.`,
              movie: movie,
            })
            .end();
        else
          res
            .json({
              menssage: `No se añadio la pelicula, ya existe una con el id: ${movie.id}`,
            })
            .end();
      })
      .catch((error) => {
        responseErrorHttp(error, res);
      });
  }

  async delMovie(req: express.Request, res: express.Response): Promise<void> {
    const { id } = req.params;
    delMovie(id)
      .then((data) => {
        if (data)
          res
            .json({
              message: "Se elimino la pelicula.",
              movie: data,
            })
            .end();
        else
          res
            .json({
              message: `No existe ninguna pelicula con el id: ${id}`,
            })
            .end();
      })
      .catch((error) => {
        responseErrorHttp(error, res);
      });
  }

  async modifyMovie(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    const { id } = req.params;
    const body = zMovieModify.parse({ id, ...req.body });
    if (!body || Object.keys(body).length === 0) {
      res
        .status(400)
        .json({ message: "No has mandado datos para modificar" })
        .end();
      return;
    }
    modifyMovie(body)
      .then((data) => {
        res.json({ messaje: "Se modifico la pelicula", movie: data }).end();
      })
      .catch((error) => {
        responseErrorHttp(error, res);
      });
  }
}
