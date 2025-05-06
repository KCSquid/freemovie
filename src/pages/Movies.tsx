import { useState } from "react"
import { useEffect } from "react";
import { NavBar } from "../components/ui/navbar";
import { API_KEY } from "../lib/config";
import { Movie } from "../constants/movie";
import { MovieSection } from "../components/ui/movie-section";
import { movieConfig } from "../constants/movie-config";
import { MoviesResult } from "../constants/movies-result";
import { SkeletonPreloader } from "../components/ui/skeleton-preloader";

export default function Movies() {
  const [moviesData, setMoviesData] = useState<Record<string, MoviesResult>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    };

    const baseUrl = "https://api.themoviedb.org/3/movie/";
    const baseArgs = "?language=en-US&page=1";

    Promise.all(
      movieConfig
        .filter((m) => !m.type || m.type === "movie")
        .map(async (m) => {
          const url = `${baseUrl}${m.category}${baseArgs}`;
          const response = await fetch(url, options);
          const json = await response.json();
          return { key: m.key, data: { title: m.title, description: m.description, results: json.results } };
        })
    ).then((movies) => {
      const moviesObject = movies.reduce((acc, movie) => {
        acc[movie.key] = movie.data;
        return acc;
      }, {} as Record<string, MoviesResult>);
      setMoviesData(moviesObject);
    });

    setLoading(false);
  }, []);

  if (loading || !moviesData || Object.keys(moviesData ?? {}).length !== movieConfig.filter((m) => !m.type || m.type === "movie").length) {
    return <SkeletonPreloader />;
  }

  moviesData.nowPlaying.results = moviesData.nowPlaying.results.filter(
    (movie: Movie) => !moviesData.popular.results.some((popularMovie: Movie) => popularMovie.id === movie.id)
  );

  moviesData.upcoming.results = moviesData.upcoming.results.filter(
    (movie: Movie) =>
      !moviesData.popular.results.some((popularMovie: Movie) => popularMovie.id === movie.id) &&
      !moviesData.nowPlaying.results.some((nowPlayingMovie: Movie) => nowPlayingMovie.id === movie.id) &&
      !moviesData.topRated.results.some((topRatedMovie: Movie) => topRatedMovie.id === movie.id)
  );
  moviesData.upcoming.results = moviesData.upcoming.results.map((movie: Movie) => ({ ...movie, unavailable: true }));

  return (
    <div className="flex flex-col justify-center min-h-svh bg-slate-950 px-4 md:px-16 lg:px-64 py-8 md:py-16 gap-8">
      <NavBar />
      {movieConfig.filter((m) => !m.type || m.type === "movie").map((config) => (
        <MovieSection
          key={config.key}
          title={config.title}
          description={config.description}
          movies={moviesData[config.key]?.results || []}
        />
      ))}
    </div>
  )
}