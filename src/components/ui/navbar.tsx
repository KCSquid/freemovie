import { useNavigate } from "react-router-dom";
import { Popcorn } from "lucide-react";
import { Input } from "./input";
import { useState } from "react";
import { Movie } from "@/constants/movie";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Separator } from "./separator";

export function NavBar() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <button
          className="font-bold text-yellow-300 flex gap-2 items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Popcorn size={20} /> freemovie
        </button>
        <div className="relative w-2/3 md:w-1/3">
          <Input
            placeholder="Search for a movie..."
            className="w-full border-slate-800 outline-none text-white"
            onChange={(e) => {
              const searchValue = e.target.value;
              if (!searchValue) {
                setSearchResults([]);
                setShowDropdown(false);
                return;
              }

              const url = `https://api.themoviedb.org/3/search/multi?query=${searchValue}&include_adult=false&language=en-US&page=1`;
              const options = {
                method: "GET",
                headers: {
                  accept: "application/json",
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGI0ODY5ZTVjMGYxM2M1OTczZmEyNmQ2MGVlOGU3MiIsIm5iZiI6MTc0NTE2NTAzMC4yNzIsInN1YiI6IjY4MDUxYWU2Mjc2YmY2NGU0MWFhOGVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xE1kRINaKWk-kFA7KHgZ1wIgTBBSnO5CzUirjJjSSf8",
                },
              };

              fetch(url, options)
                .then((res) => res.json())
                .then((json) => {
                  setSearchResults(json.results.filter((r: Movie) => r.poster_path) || []);
                  setShowDropdown(true);
                })
                .catch((err) => console.error(err));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = (e.target as HTMLInputElement).value.trim();
                if (query) {
                  navigate(`/search?query=${encodeURIComponent(query)}`);
                  setShowDropdown(false);
                }
              }
            }}
          />
          {showDropdown && searchResults.length > 0 && (
            <ul className="absolute z-10 bg-slate-950 text-white w-full border border-slate-800 rounded-md mt-1 max-h-60 overflow-y-auto px-4 pt-4">
              {searchResults.map((result) => (
                <>
                  <li
                    key={result.id}
                    className="p-2 hover:bg-slate-900 cursor-pointer rounded-md flex flex-col gap-3 s-center"
                    onClick={() => {
                      navigate(`/watch?${result.name ? "tv" : "movie"}=${result.id}`);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`} />
                        <AvatarFallback className="bg-black">?</AvatarFallback>
                      </Avatar>

                      <span className="mt-0.5">{result.title || result.name}</span>
                    </div>

                  </li>
                  <Separator className="bg-slate-800 my-1" />
                </>
              ))}
            </ul>


          )}
        </div>
      </div>
    </div>
  );
}