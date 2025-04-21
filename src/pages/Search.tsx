import { useSearchParams } from "react-router-dom";

import { useState } from "react"
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { NavBar } from "@/components/ui/navbar";
import { API_KEY } from "@/lib/config";
import { Movie } from "@/interfaces/movie";
import { MovieSection } from "@/components/ui/movie-section";

interface MoviesResult {
  page: number;
  results: Movie[];
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query");

  const [searchResults, setSearchResults] = useState<MoviesResult>();

  useEffect(() => {
    if (!searchQuery) return;

    const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(searchQuery)}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        const filteredResults = {
          ...json,
          results: json.results.filter((movie: Movie) => movie.poster_path),
        };
        setSearchResults(filteredResults);
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

  if (!searchResults) {
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
      <MovieSection
        title={`Search Results for "${searchQuery?.charAt(0).toUpperCase() + searchQuery?.slice(1)}"`}
        description="Movies matching your search query."
        movies={searchResults.results}
      />
    </div>
  );
}
