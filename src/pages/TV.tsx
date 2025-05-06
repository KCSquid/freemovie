import { useState } from "react"
import { useEffect } from "react";
import { NavBar } from "../components/ui/navbar";
import { API_KEY } from "../lib/config";
import { MovieSection } from "../components/ui/movie-section";
import { movieConfig } from "../constants/movie-config";
import { MoviesResult } from "../constants/movies-result";
import { SkeletonPreloader } from "../components/ui/skeleton-preloader";

export default function TV() {
  const [tvData, setTvData] = useState<Record<string, MoviesResult>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    };

    const baseUrl = "https://api.themoviedb.org/3/tv/";
    const baseArgs = "?language=en-US&page=1";

    Promise.all(
      movieConfig
        .filter((m) => m.type === "tv")
        .map(async (m) => {
          const url = `${baseUrl}${m.category}${baseArgs}`;
          const response = await fetch(url, options);
          const json = await response.json();
          return { key: m.key, data: { title: m.title, description: m.description, results: json.results } };
        })
    ).then((tvShows) => {
      const tvObject = tvShows.reduce((acc, tvShow) => {
        acc[tvShow.key] = tvShow.data;
        return acc;
      }, {} as Record<string, MoviesResult>);
      setTvData(tvObject);
    });

    setLoading(false);
  }, []);

  if (loading || !tvData || Object.keys(tvData ?? {}).length !== movieConfig.filter((m) => m.type === "tv").length) {
    return <SkeletonPreloader />;
  }

  return (
    <div className="flex flex-col justify-center min-h-svh bg-slate-950 px-4 md:px-16 lg:px-64 py-8 md:py-16 gap-8">
      <NavBar />
      {movieConfig.filter((m) => m.type === "tv").map((config) => (
        <MovieSection
          key={config.key}
          title={config.title}
          description={config.description}
          movies={tvData[config.key]?.results || []}
        />
      ))}
    </div>
  )
}
