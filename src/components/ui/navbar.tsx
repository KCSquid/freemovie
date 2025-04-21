import { useNavigate } from "react-router-dom";
import { Popcorn } from "lucide-react";
import { Input } from "./input";


export function NavBar() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between">
      <button
        className="font-bold text-yellow-300 flex gap-2 items-center cursor-pointer"
        onClick={() => navigate("/")}><Popcorn size={20} /> freemovie</button>
      <Input
        placeholder="Search for a movie..."
        className="w-2/3 md:w-1/3 border-slate-800 outline-none text-white"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const query = (e.target as HTMLInputElement).value.trim();
            if (query) {
              navigate(`/search?query=${encodeURIComponent(query)}`);
            }
          }
        }}
      />
    </div>
  )
}