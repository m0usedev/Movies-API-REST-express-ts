import { MovieError } from "@/error/movies-error";
import express from "express";
import { ZodError } from "zod";

export async function responseErrorHttp(
  error: Error,
  res: express.Response,
): Promise<void> {
  if (error instanceof ZodError) {
    const errors = error.errors.map((error) => {
      return error.message;
    });
    res // Todos los no previstos y: FileError
      .status(400)
      .json({
        type: error.name,
        message: errors,
      })
      .end();
    return;
  }
  if (error instanceof MovieError) {
    res // Todos los no previstos y: FileError
      .status(400)
      .json({
        type: error.name,
        message: error.message,
      })
      .end();
    return;
  }
  res // Todos los no previstos y: FileError
    .status(500)
    .json({
      type: error.name,
      message: error.message,
    })
    .end();
}
