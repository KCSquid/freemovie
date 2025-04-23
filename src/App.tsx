import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Watch from "./pages/Watch";
import Search from "./pages/Search";

import { useState } from "react"
import { useEffect } from "react";
import { NavBar } from "./components/ui/navbar";
import { API_KEY } from "./lib/config";
import { Movie } from "./constants/movie";
import { MovieSection } from "./components/ui/movie-section";
import { movieConfig } from "./constants/movie-config";
import { MoviesResult } from "./constants/movies-result";
import Genre from "./pages/Genre";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/search" element={<Search />} />
        <Route path="/genre" element={<Genre />} />
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
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-white font-bold text-xl md:text-2xl">Search by Genre</h1>
          <h2 className="text-slate-400 font-medium text-sm md:text-base">Find movies & TV based on a common genre.</h2>
        </div>
        <Separator className="bg-slate-800" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[
            { name: "Action", uri: "action" },
            { name: "Adventure", uri: "adventure" },
            { name: "Animation", uri: "animation" },
            { name: "Comedy", uri: "comedy" },
            { name: "Crime", uri: "crime" },
            { name: "Documentary", uri: "documentary" },
            { name: "Drama", uri: "drama" },
            { name: "Family", uri: "family" },
            { name: "Fantasy", uri: "fantasy" },
            { name: "History (Movies)", uri: "history" },
            { name: "Horror (Movies)", uri: "horror" },
            { name: "Kids (TV Shows)", uri: "kids" },
            { name: "Music (Movies)", uri: "music" },
            { name: "Mystery", uri: "mystery" },
            { name: "News (TV Shows)", uri: "news" },
            { name: "Reality (TV Shows)", uri: "reality" },
            { name: "Romance (Movies)", uri: "romance" },
            { name: "Sci-Fi & Fantasy", uri: "sci" },
            { name: "Soap (TV Shows)", uri: "soap" },
            { name: "Talk (TV Shows)", uri: "talk" },
            { name: "Thriller (Movies)", uri: "thriller" },
            { name: "TV Movie (Movies)", uri: "tv movie" },
            { name: "War & Politics", uri: "war" },
            { name: "Western", uri: "western" },
          ].map(({ name, uri }) => (
            <ShadButton
              key={name}
              title={name.length > 20 ? `${name.slice(0, 17)}...` : name}
              uri={uri}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ShadButton({ title, uri }: { title: string; uri: string; }) {
  const navigate = useNavigate();

  return (
    <Button
      className="bg-slate-900 border-slate-800 cursor-pointer text-white font-semibold"
      variant={"outline"}
      onClick={() => navigate(`/genre?code=${uri}`)}
    >
      <span className="text-base">{title}</span>
    </Button>
  );
}
