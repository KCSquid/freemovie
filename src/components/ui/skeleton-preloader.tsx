import { NavBar } from "./navbar";
import { Skeleton } from "./skeleton";

export function SkeletonPreloader() {
  return (
    <div className="flex flex-col justify-center min-h-svh bg-slate-950 px-4 md:px-16 lg:px-64 py-8 md:py-16 gap-8">
      <NavBar />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <Skeleton className="bg-slate-800 w-[150px] h-[25px] rounded-full" />
          <Skeleton className="bg-slate-800 w-[250px] h-[20px] rounded-full" />
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div className="flex flex-col gap-2">
                <Skeleton key={idx} className="bg-slate-800 w-full max-w-[225px] h-[300px] rounded-lg" />
                <Skeleton className="bg-slate-800 w-[175px] h-[25px] rounded-full" />
                <Skeleton className="bg-slate-800 w-[200px] h-[20px] rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}