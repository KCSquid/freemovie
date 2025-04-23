import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";

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

interface MovieDetails {
  title: string;
}

export default function MoviePlayer() {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("movie");
  const tvId = searchParams.get("tv");

  const [movieDetails, setMovieDetails] = useState<MovieDetails>();

  useEffect(() => {
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
  }, [movieId]);

  if (!movieId && !tvId) {
    return <div>ID is missing in the query parameters.</div>;
  }

  if (!movieDetails) {
    return <div></div>
  }

  return (
    <div className="flex flex-col justify-center min-h-svh bg-slate-950 px-4 md:px-16 lg:px-64 py-8 md:py-16 gap-8">
      <NavBar />
      <div className="border p-4 border-slate-800 rounded-md flex flex-col gap-4 justify-center">
        <Breadcrumb>
          <BreadcrumbList>
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
    </div>
  )
}
