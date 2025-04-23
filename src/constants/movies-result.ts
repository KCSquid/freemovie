import { Movie } from "./movie";

export interface MoviesResult {
  title: string;
  description: string;
  results: Movie[];
}
