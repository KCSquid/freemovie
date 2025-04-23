import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Watch from "./pages/Watch";
import Search from "./pages/Search";

import { useState } from "react"
import { useEffect } from "react";
import { NavBar } from "./components/ui/navbar";
import { API_KEY } from "./lib/config";
import { Movie } from "./constants/movie";
import { MovieSection } from "./components/ui/movie-section";
import { movieConfig } from "./constants/movie-config";

interface MoviesResult {
  title: string;
  description: string;
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
  const [moviesData, setMoviesData] = useState<Record<string, MoviesResult>>();
  const [myList, setMyList] = useState<Movie[]>([]);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    };

    const baseUrl = "https://api.themoviedb.org/3/";
    const baseArgs = "?language=en-US&page=1";

    Promise.all(
      movieConfig.map(async (m) => {
        const url = `${baseUrl}${m.type ?? "movie"}/${m.category}${baseArgs}`
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

    const fetchMovieDetails = async (id: number) => {
      const url = `${baseUrl}${id.toString().startsWith("tv") ? "tv" : "movie"}/${id.toString().slice(3)}?language=en-US`;
      const response = await fetch(url, options);
      const json = await response.json();
      return json as Movie;
    };

    const myListStorage = JSON.parse(localStorage.getItem("myList") || "[]");
    myListStorage.forEach((id: number) => {
      fetchMovieDetails(id).then((movie) =>
        myListStorage.push(movie)
      );
    });

    Promise.all(myListStorage.map(fetchMovieDetails)).then((movies) => {
      setMyList(movies);
    });
  }, []);


  if (!moviesData || Object.keys(moviesData ?? {}).length !== movieConfig.length) {
    return <div></div>
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

  myList.forEach((movie) => {
    movie.isClicked = true;
  });

  return (
    <div className="flex flex-col justify-center min-h-svh bg-slate-950 px-4 md:px-16 lg:px-64 py-8 md:py-16 gap-8">
      <NavBar />
      {myList.length > 0 && <MovieSection title="My List" description="Your saved movies & TV shows" movies={myList} />}
      {movieConfig.map((config) => (
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