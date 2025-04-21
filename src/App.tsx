import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Watch from "./pages/Watch";
import Search from "./pages/Search";

import { useState } from "react"
import { useEffect } from "react";
import { NavBar } from "./components/ui/navbar";
import { API_KEY } from "./lib/config";
import { Movie } from "./interfaces/movie";
import { MovieSection } from "./components/ui/movie-section";

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