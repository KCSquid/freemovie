import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Fullscreen, TriangleAlert } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NavBar } from "@/components/ui/navbar";
import { API_KEY } from "@/lib/config";
import { MovieSection } from "@/components/ui/movie-section";
import { MoviesResult } from "@/constants/movies-result";
import { Movie } from "@/constants/movie";
import { Button } from "@/components/ui/button";

interface MovieDetails {
  title: string;
}

export default function MoviePlayer() {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("movie");
  const tvId = searchParams.get("tv");

  const [movieDetails, setMovieDetails] = useState<MovieDetails>();
  const [similarMovies, setSimilarMovies] = useState<MoviesResult>();

  useEffect(() => {
    const getMovieInfo = () => {
      const url = `https://api.themoviedb.org/3/${movieId ? "movie" : "tv"}/${movieId}?language=en-US`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      };

      fetch(url, options)
        .then(res => res.json())
        .then(json => setMovieDetails(json))
        .catch(err => console.error(err));
    }

    const getSimilarMovies = () => {
      const url = `https://api.themoviedb.org/3/${movieId ? "movie" : "tv"}/${movieId ?? tvId}/similar?language=en-US&page=1`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGI0ODY5ZTVjMGYxM2M1OTczZmEyNmQ2MGVlOGU3MiIsIm5iZiI6MTc0NTE2NTAzMC4yNzIsInN1YiI6IjY4MDUxYWU2Mjc2YmY2NGU0MWFhOGVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xE1kRINaKWk-kFA7KHgZ1wIgTBBSnO5CzUirjJjSSf8'
        }
      };

      fetch(url, options)
        .then(res => res.json())
        .then(json => {
          const filteredResults = {
            ...json,
            results: json.results.filter((movie: Movie) => movie.poster_path),
          };
          setSimilarMovies(filteredResults);
        })
        .catch(err => console.error(err));
    }

    getMovieInfo();
    getSimilarMovies();
  }, [movieId, tvId]);

  if (!movieId && !tvId) {
    return <div>ID is missing in the query parameters.</div>;
  }

  if (!movieDetails || !similarMovies) {
    return <div></div>
  }

  return (
    <div className="flex flex-col justify-center min-h-svh bg-slate-950 px-4 md:px-16 lg:px-64 py-8 md:py-16 gap-8">
      <NavBar />
      <div className="flex flex-col justify-center gap-16">
        <div className="border p-4 border-slate-800 rounded-md flex flex-col gap-4 justify-center">
          <Breadcrumb>
            <BreadcrumbList className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-slate-500 hover:text-slate-400 font-medium">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-slate-500 hover:text-slate-400 font-medium">{movieId ? "Movies" : "TV Shows"}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-semibold">{movieDetails.title ?? "Watch"}</BreadcrumbPage>
                </BreadcrumbItem>
              </div>
              <Button className="cursor-pointer" variant={"ghost"} size={"icon"} onClick={() => {
                const frame = document.querySelector("iframe");
                if (frame) {
                  frame.setAttribute(
                    "style",
                    "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"
                  );
                  document.body.style.overflow = "hidden";

                  const handleEscape = (event: KeyboardEvent) => {
                    if (event.key === "Escape") {
                      frame.removeAttribute("style");
                      document.body.style.overflow = "";
                      document.removeEventListener("keydown", handleEscape);
                    }
                  };

                  document.addEventListener("keydown", handleEscape);
                }
              }}>
                <Fullscreen />
              </Button>
            </BreadcrumbList>

          </Breadcrumb>
          <iframe
            src={`https://vidsrc.xyz/embed/${movieId ? "movie" : "tv"}/${movieId ?? tvId}`}
            allowFullScreen
            className="w-full h-[50vh] md:h-[80vh] rounded-md border border-slate-800"
          />
          <div className="flex text-white gap-2 items-center">
            <TriangleAlert size={20} className="text-yellow-200" />
            <h1 className="text-yellow-200 font-medium text-xs md:text-sm">
              Some conditions may cause movie to show up as blank. Changing browsers, disabling ad blockers, and refreshing the page are all possible troubleshooting solutions. {tvId && "Not all episodes of every TV Show will show up. We do our best to add as many as we can."}
            </h1>
          </div>
        </div>
        <MovieSection title="You May Also Like" description="Movies & TV Shows similar to this one." movies={similarMovies.results} />
      </div >
    </div >
  )
}
