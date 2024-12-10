export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  duration: number;
  poster: string;
  genre: string[];
  rate: number;
}

export type MovieQuery = Partial<Omit<Movie, "id" | "title" | "poster">>;

export type TypeValuesMovieQuery = MovieQuery[keyof MovieQuery];

export type MovieModify = {
  id: string; // id permanece obligatorio
} & Partial<Omit<Movie, "id">>;
