import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Watch from "./pages/Watch";
import Search from "./pages/Search";

import { useState } from "react"
import { useEffect } from "react";
import { Separator } from "./components/ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./components/ui/hover-card";
import { PlayCircle } from "lucide-react";
import { Button } from "./components/ui/button";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { NavBar } from "./components/ui/navbar";
import { API_KEY } from "./lib/config";

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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}


function Home() {
  const [popularMovies, setPopularMovies] = useState<MoviesResult>();
  const [nowPlayingMovies, setNowPlayingMovies] = useState<MoviesResult>();
  const [topRatedMovies, setTopRatedMovies] = useState<MoviesResult>();
  const [upcomingMovies, setUpcomingMovies] = useState<MoviesResult>();

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    };

    const fetchPopularMovies = () => {
      const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
      fetch(url, options)
        .then(res => res.json())
        .then(json => setPopularMovies(json))
        .catch(err => console.error(err));
    };

    const fetchNowPlayingMovies = () => {
      const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
      fetch(url, options)
        .then(res => res.json())
        .then(json => setNowPlayingMovies(json))
        .catch(err => console.error(err));
    };

    const fetchTopRatedMovies = () => {
      const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
      fetch(url, options)
        .then(res => res.json())
        .then(json => setTopRatedMovies(json))
        .catch(err => console.error(err));
    };

    const fetchUpcomingMovies = () => {
      const url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
      fetch(url, options)
        .then(res => res.json())
        .then(json => setUpcomingMovies(json))
        .catch(err => console.error(err));
    };

    fetchPopularMovies();
    fetchNowPlayingMovies();
    fetchTopRatedMovies();
    fetchUpcomingMovies();
  }, []);

  if (!popularMovies || !nowPlayingMovies || !topRatedMovies || !upcomingMovies) {
    return <div></div>
  }

  nowPlayingMovies.results = nowPlayingMovies.results.filter(
    (movie) => !popularMovies.results.some((popularMovie) => popularMovie.id === movie.id)
  );

  upcomingMovies.results = upcomingMovies.results.filter(
    (movie) =>
      !popularMovies.results.some((popularMovie) => popularMovie.id === movie.id) &&
      !nowPlayingMovies.results.some((nowPlayingMovie) => nowPlayingMovie.id === movie.id) &&
      !topRatedMovies.results.some((topRatedMovie) => topRatedMovie.id === movie.id)
  );
  upcomingMovies.results = upcomingMovies.results.map((movie) => ({ ...movie, unavailable: true }));

  return (
    <div className="flex flex-col justify-center min-h-svh bg-slate-950 px-4 md:px-16 lg:px-64 py-8 md:py-16 gap-8">
      <NavBar />
      <MovieSection title="Popular Movies" description="Most popular & trending movies as of now." movies={popularMovies.results} />
      <MovieSection title="Now Playing" description="Movies currently playing in theaters. (Excluding Popular)" movies={nowPlayingMovies.results} />
      <MovieSection title="Top Rated" description="Top-rated movies of all time." movies={topRatedMovies.results} />
      <MovieSection title="Upcoming Movies" description="Movies that are coming soon to theaters." movies={upcomingMovies.results} />
    </div>
  )
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
            <h1 className="text-lg font-semibold">{movie.title} <span className="text-slate-400">({movie.release_date.slice(0, 4)})</span></h1>
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
