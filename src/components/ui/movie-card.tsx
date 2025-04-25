import { useNavigate } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { Heart, PlayCircle } from "lucide-react";
import { Button } from "./button";
import { Separator } from "./separator";
import { Movie } from "@/constants/movie";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useEffect, useState } from "react";

export function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [trailer, setTrailer] = useState<string>();

  useEffect(() => {
    if (!isHovering) return;

    const url = `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`;
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
        const youtubeTrailer = json.results.find(
          (video: { site: string; type: string; key: string }) => video.site === "YouTube" && video.type === "Trailer"
        );
        if (youtubeTrailer) {
          setTrailer(`https://www.youtube.com/embed/${youtubeTrailer.key}?autoplay=1&showinfo=0&modestbranding=1`);
        }
      })
      .catch(err => console.error(err));
  }, [isHovering, movie.id]);

  return (
    <div className="flex flex-col gap-2 hover:brightness-125 transition-all duration-300 w-full shadow-sm">
      {window.innerWidth > 768 ? (
        <HoverCard openDelay={500}>
          <HoverCardTrigger asChild onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} className="rounded-md" />
          </HoverCardTrigger>
          <HoverCardContent key={movie.id} className="w-80 bg-slate-900 text-white border-slate-800 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-semibold">{movie.title ?? movie.name} <span className="text-slate-400">({(movie.release_date ?? movie.first_air_date).slice(0, 4)})</span></h1>
              <Separator className="bg-slate-800" />
              {trailer && <iframe src={trailer} allowFullScreen className="border border-slate-800 rounded-sm"></iframe>}
              <h1 className="text-sm font-base text-slate-400">{movie.overview}</h1>
            </div>

            <div className="flex items-center justify-between">
              <h1 className="font-semibold">Interested?</h1>
              <div className="flex gap-2">
                <Button
                  className="bg-slate-900 border-slate-800 cursor-pointer group"
                  variant={"outline"}
                  disabled={movie.unavailable}
                  onClick={() => {
                    const myList = JSON.parse(localStorage.getItem("myList") || "[]");
                    const prefix = movie.title ? "mv" : "tv";
                    const movieIdWithPrefix = `${prefix}-${movie.id}`;
                    if (!myList.includes(movieIdWithPrefix)) {
                      myList.push(movieIdWithPrefix);
                      movie.isClicked = true;
                    } else {
                      const index = myList.indexOf(movieIdWithPrefix);
                      if (index > -1) {
                        myList.splice(index, 1);
                        movie.isClicked = false;
                      }
                    }
                    document.querySelectorAll(".lucide-heart").forEach((el) => {
                      const heart = el as HTMLElement;
                      heart.style.fill = movie.isClicked ? "red" : "";
                      heart.style.color = movie.isClicked ? "red" : "";
                      console.log(heart.style.fill)
                    });
                    localStorage.setItem("myList", JSON.stringify(myList));
                  }}
                >
                  <Heart className="group-hover:fill-red-500 group-hover:text-red-500 transition-all" style={{
                    fill: movie.isClicked ? "red" : "none",
                    color: movie.isClicked ? "red" : "inherit",
                  }} />
                </Button>
                <Button
                  className="bg-slate-900 border-slate-800 cursor-pointer"
                  variant={"outline"}
                  disabled={movie.unavailable}
                  onClick={() => navigate(`/watch?${movie.title ? "movie" : "tv"}=${movie.id}`)}
                ><PlayCircle />Watch Now</Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} className="rounded-md" />
          </PopoverTrigger>
          <PopoverContent key={movie.id} className="w-80 bg-slate-900 text-white border-slate-800 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-semibold">{movie.title ?? movie.name} <span className="text-slate-400">({(movie.release_date ?? movie.first_air_date).slice(0, 4)})</span></h1>
              <Separator className="bg-slate-800" />
              <h1 className="text-sm font-base text-slate-400">{movie.overview}</h1>
            </div>

            <div className="flex items-center justify-between">
              <h1 className="font-semibold">Interested?</h1>
              <div className="flex gap-2">
                <Button
                  className="bg-slate-900 border-slate-800 cursor-pointer group"
                  variant={"outline"}
                  disabled={movie.unavailable}
                  onClick={() => {
                    const myList = JSON.parse(localStorage.getItem("myList") || "[]");
                    const prefix = movie.title ? "mv" : "tv";
                    const movieIdWithPrefix = `${prefix}-${movie.id}`;
                    if (!myList.includes(movieIdWithPrefix)) {
                      myList.push(movieIdWithPrefix);
                      movie.isClicked = true;
                    } else {
                      const index = myList.indexOf(movieIdWithPrefix);
                      if (index > -1) {
                        myList.splice(index, 1);
                        movie.isClicked = false;
                      }
                    }
                    document.querySelectorAll(".lucide-heart").forEach((el) => {
                      const heart = el as HTMLElement;
                      heart.style.fill = movie.isClicked ? "red" : "";
                      heart.style.color = movie.isClicked ? "red" : "";
                      console.log(heart.style.fill)
                    });
                    localStorage.setItem("myList", JSON.stringify(myList));
                  }}
                >
                  <Heart className="group-hover:fill-red-500 group-hover:text-red-500 transition-all" style={{
                    fill: movie.isClicked ? "red" : "none",
                    color: movie.isClicked ? "red" : "inherit",
                  }} />
                </Button>
                <Button
                  className="bg-slate-900 border-slate-800 cursor-pointer"
                  variant={"outline"}
                  disabled={movie.unavailable}
                  onClick={() => navigate(`/watch?${movie.title ? "movie" : "tv"}=${movie.id}`)}
                ><PlayCircle />Watch Now</Button>
              </div>
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
