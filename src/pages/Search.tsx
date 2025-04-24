import { useSearchParams } from "react-router-dom";

import { useState } from "react"
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { NavBar } from "@/components/ui/navbar";
import { API_KEY } from "@/lib/config";
import { Movie } from "@/constants/movie";
import { MovieSection } from "@/components/ui/movie-section";
import { SkeletonPreloader } from "@/components/ui/skeleton-preloader";

interface MoviesResult {
  page: number;
  results: Movie[];
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query");

  const [movieResults, setMovieResults] = useState<MoviesResult>();
  const [tvResults, setTvResults] = useState<MoviesResult>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchQuery) return;

    const movieUrl = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(searchQuery)}`;
    const tvUrl = `https://api.themoviedb.org/3/search/tv?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(searchQuery)}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    };

    Promise.all([
      fetch(movieUrl, options)
        .then(res => res.json())
        .then(json => {
          const filteredResults = {
            ...json,
            results: json.results.filter((movie: Movie) => movie.poster_path),
          };
          setMovieResults(filteredResults);
        }),
      fetch(tvUrl, options)
        .then(res => res.json())
        .then(json => {
          const filteredResults = {
            ...json,
            results: json.results.filter((tv: Movie) => tv.poster_path),
          };
          setTvResults(filteredResults);
        })
    ]).finally(() => setLoading(false));
  }, [searchQuery]);

  if (loading) {
    return <SkeletonPreloader />;
  }

  if (!searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh bg-slate-950 px-4 md:px-16 lg:px-64 py-8 md:py-16 gap-8">
        <h1 className="text-white font-bold">Please add a valid search...</h1>
        <Button className="cursor-pointer" onClick={() => window.location.href = "/"}>Home</Button>
      </div>
    )
  }

  if (!movieResults && !tvResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh bg-slate-950 px-4 md:px-16 lg:px-64 py-8 md:py-16 gap-8">
        <h1 className="text-white font-bold">Sorry, no results found...</h1>
        <Button className="cursor-pointer" onClick={() => window.location.href = "/"}>Home</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center min-h-svh bg-slate-950 px-4 md:px-16 lg:px-64 py-8 md:py-16 gap-8">
      <NavBar />
      {movieResults && movieResults.results.length > 0 && (
        <MovieSection
          title={`Movie Results for "${searchQuery?.charAt(0).toUpperCase() + searchQuery?.slice(1)}"`}
          description="Movies matching your search query."
          movies={movieResults.results}
        />
      )}
      {tvResults && tvResults.results.length > 0 && (
        <MovieSection
          title={`TV Results for "${searchQuery?.charAt(0).toUpperCase() + searchQuery?.slice(1)}"`}
          description="TV shows matching your search query."
          movies={tvResults.results}
        />
      )}
    </div>
  );
}
