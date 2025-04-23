import { useSearchParams } from "react-router-dom";

import { useRef, useState } from "react"
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { NavBar } from "@/components/ui/navbar";
import { API_KEY } from "@/lib/config";
import { Movie } from "@/constants/movie";
import { MovieSection } from "@/components/ui/movie-section";

interface MoviesResult {
  page: number;
  results: Movie[];
}

export default function Genre() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("code");

  const [movieResults, setMovieResults] = useState<MoviesResult>();
  const [tvResults, setTvResults] = useState<MoviesResult>();
  const [genreMeaning, setGenreMeaning] = useState<string | undefined>();

  const genreFound = useRef(false);

  useEffect(() => {
    if (!searchQuery) return;

    const genreMeaningUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
    const tvGenreMeaningUrl = 'https://api.themoviedb.org/3/genre/tv/list?language=en';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    };

    fetch(genreMeaningUrl, options)
      .then(res => res.json())
      .then(json => {
        const genre = json.genres.find((g: { id: number; name: string }) => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (genre) {
          setGenreMeaning(genre.name);
          const movieUrl = `https://api.themoviedb.org/3/discover/movie?with_genres=${genre.id}&sort_by=popularity.desc`;

          fetch(movieUrl, options)
            .then(res => res.json())
            .then(json => {
              const filteredResults = {
                ...json,
                results: json.results.filter((movie: Movie) => movie.poster_path),
              };
              setMovieResults(filteredResults);
              genreFound.current = true;
            })
            .catch(err => console.error(err));
        } else {
          setGenreMeaning("Unknown");
        }
      })
      .catch(err => console.error(err));

    fetch(tvGenreMeaningUrl, options)
      .then(res => res.json())
      .then(json => {
        const genre = json.genres.find((g: { id: number; name: string }) => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (genre) {
          if (!genreFound.current) setGenreMeaning(genre.name)
          const tvUrl = `https://api.themoviedb.org/3/discover/tv?with_genres=${genre.id}&sort_by=popularity.desc`;

          fetch(tvUrl, options)
            .then(res => res.json())
            .then(json => {
              const filteredResults = {
                ...json,
                results: json.results.filter((tv: Movie) => tv.poster_path),
              };
              setTvResults(filteredResults);
            })
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  }, [searchQuery]);

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
          title={`Movie Results for "${genreMeaning}"`}
          description="Movies matching your search query."
          movies={movieResults.results}
        />
      )}
      {tvResults && tvResults.results.length > 0 && (
        <MovieSection
          title={`TV Results for "${genreMeaning}"`}
          description="TV shows matching your search query."
          movies={tvResults.results}
        />
      )}
    </div>
  );
}
