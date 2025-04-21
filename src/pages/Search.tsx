import { useNavigate, useSearchParams } from "react-router-dom";

import { useState } from "react"
import { useEffect } from "react";
import { Separator } from "../components/ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../components/ui/hover-card";
import { PlayCircle } from "lucide-react";
import { Button } from "../components/ui/button";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { NavBar } from "@/components/ui/navbar";
import { API_KEY } from "@/lib/config";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  unavailable: boolean;
}

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

function MovieSection({ title, description, movies }: { title: string; description: string; movies: Movie[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-white font-bold text-xl md:text-2xl">{title}</h1>
        <h2 className="text-slate-400 font-medium text-sm md:text-base">{description}</h2>
      </div>
      <Separator className="bg-slate-800" />
      <Carousel opts={{ align: "start", loop: true }}>
        <CarouselContent>
          {movies.map((movie: Movie) => (
            <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/6" key={movie.id}>
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 hover:brightness-125 transition-all duration-300 w-full shadow-sm">
      <HoverCard openDelay={500}>
        <HoverCardTrigger asChild>
          <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} className="rounded-md" />
        </HoverCardTrigger>
        <HoverCardContent className="w-80 bg-slate-900 text-white border-slate-800 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-semibold">{movie.title} <span className="text-slate-400">{movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ""}</span></h1>
            <Separator className="bg-slate-800" />
            <h1 className="text-sm font-base text-slate-400">{movie.overview}</h1>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="font-semibold">Interested?</h1>
            <Button
              className="bg-slate-900 border-slate-800 cursor-pointer"
              variant={"outline"}
              disabled={movie.unavailable}
              onClick={() => navigate(`/watch?movie=${movie.id}`)}
            ><PlayCircle />Watch Now</Button>
          </div>
        </HoverCardContent>
      </HoverCard>
      <div>
        <h1 className="text-white font-semibold text-base">{movie.title}</h1>
        <h1 className="text-slate-400 font-medium text-sm">{movie.overview.substring(0, 40)}...</h1>
      </div>
    </div>
  )
}
