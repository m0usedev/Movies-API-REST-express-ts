import { z } from "zod";

const customInvalidTypeError = (propName: string, type: string): string =>
  `La propiedad "${propName}" debe ser un "${type}"`;

const customRequiredError = (propName: string, type: string): string =>
  `Falta la propiedad "${propName}", que debe ser un "${type}"`;

const customError = (propName: string, type: string): object => {
  return {
    invalid_type_error: customInvalidTypeError(propName, type),
    required_error: customRequiredError(propName, type),
  };
};

export const zMovie = z
  .object({
    id: z.string(customError("id", "string")),
    title: z.string(customError("title", "string")),
    year: z.number().int().positive(customError("year", "int")),
    director: z.string(customError("director", "string")),
    duration: z.number(customError("duration", "string")),
    poster: z.string().url(customError("poster", "url")),
    genre: z.array(z.string(customError("genre", "string[]"))),
    rate: z.number().positive(customError("rate", "number")),
  })
  .strict();

export const zMovieModify = z.object({
  id: z.string(customError("id", "string")),
  title: z.string(customError("title", "string")).optional(),
  year: z.number().int().positive(customError("year", "int")).optional(),
  director: z.string(customError("director", "string")).optional(),
  duration: z.number(customError("duration", "string")).optional(),
  poster: z.string().url(customError("poster", "url")).optional(),
  genre: z.array(z.string(customError("genre", "string[]"))).optional(),
  rate: z.number().positive(customError("rate", "number")).optional(),
});
