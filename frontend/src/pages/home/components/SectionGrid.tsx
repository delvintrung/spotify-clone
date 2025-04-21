import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { Lock } from "lucide-react";
import PremiumWatermark from "@/components/PremiumWatermark";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
  isPremium?: boolean;
};
const SectionGrid = ({
  songs,
  title,
  isLoading,
  isPremium,
}: SectionGridProps) => {
  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button
          variant="link"
          className="text-sm text-zinc-400 hover:text-white"
        >
          Show all
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className={`bg-zinc-800/40 p-4 rounded-md  ${
              song.premium
                ? ""
                : "transition-all cursor-pointer hover:bg-zinc-700/40"
            } group `}
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                {song.premium && isPremium === false && <PremiumWatermark />}
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 
									group-hover:scale-105"
                />
              </div>
              <div className="relative">
                {song?.premium ? (
                  <Lock
                    className="absolute top-[-170px] left-2 z-30"
                    size={30}
                    color="green"
                  />
                ) : null}
                <PlayButton song={song} />
              </div>
            </div>
            <h3 className="font-medium mb-2 truncate">{song.title}</h3>
            {song.artist && (
              <p className="text-sm text-zinc-400 truncate">
                {song.artist.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default SectionGrid;
