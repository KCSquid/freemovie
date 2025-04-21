import { Movie } from "@/interfaces/movie";
import { MovieCard } from "./movie-card";
import { Separator } from "./separator";


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function MovieSection({ title, description, movies }: { title: string; description: string; movies: Movie[] }) {
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
        <CarouselPrevious className="sm:flex hidden" />
        <CarouselNext className="sm:flex hidden" />
      </Carousel>
    </div>
  )
}