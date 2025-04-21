import { useNavigate } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { PlayCircle } from "lucide-react";
import { Button } from "./button";
import { Separator } from "./separator";
import { Movie } from "@/interfaces/movie";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 hover:brightness-125 transition-all duration-300 w-full shadow-sm">
      {window.innerWidth > 768 ? (
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
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} className="rounded-md" />
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-slate-900 text-white border-slate-800 flex flex-col gap-4">
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
          </PopoverContent>
        </Popover>
      )}
      <div>
        <h1 className="text-white font-semibold text-base">{movie.title}</h1>
        <h1 className="text-slate-400 font-medium text-sm">{movie.overview.substring(0, 40)}...</h1>
      </div>
    </div>
  )
}
