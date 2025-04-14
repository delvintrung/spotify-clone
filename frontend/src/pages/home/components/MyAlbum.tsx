import { EllipsisVertical, AlignJustify, List, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import ButtonPlayCustom from "./ButtonPlayCustom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@radix-ui/react-separator";
import { Input } from "@/components/ui/input";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";

const MyAlbum = () => {
  //   if (isLoading) return <SectionGridSkeleton />;
  const { songs, fetchSongs, isLoading } = useMusicStore();
  const { initializeQueue } = usePlayerStore();
  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    if (songs.length > 0) {
      initializeQueue(songs);
    }
  }, [initializeQueue, songs]);

  return (
    <div className="bg-zinc-900 h-full rounded-md ">
      <div className="flex items-center justify-between mb-4 h-[200px] bg-gradient-to-b from-gray-600 to-zinc-800">
        <div className="mt-10 mb-5 flex px-10 gap-5">
          <div className="w-40 h-40 bg-white shadow-lg rounded-lg"></div>
          <div className="mt-20">
            <p className="text-sm text-gray-300">Public playlist</p>
            <h2 className="text-3xl font-bold text-gray-300">My Album</h2>
            <p className="text-gray-300">Delvin Trung</p>
          </div>
        </div>
      </div>

      <div className="">
        <HeaderAlbum />
        {/* {songs.map((song) => (
          <div
            key={song._id}
            className={`bg-zinc-800/40 p-4 rounded-md  ${
              song.premium == 1
                ? ""
                : "transition-all cursor-pointer hover:bg-zinc-700/40"
            } group `}
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 
                                group-hover:scale-105"
                />
              </div>
              <div className="relative">
                {song?.premium == 1 ? (
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
        ))} */}
        <SongFiilter songs={songs} />
      </div>
    </div>
  );
};

const SongFiilter = ({ songs }: { songs: Song[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songs);
  const { currentSong, setCurrentSong, togglePlay } = usePlayerStore();

  const [songSeleted, setSongSeleted] = useState<Song | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const isCurrentSong = currentSong?._id === songSeleted?._id;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = songs.filter((song) =>
      song.title.toLowerCase().includes(term)
    );
    setFilteredSongs(filtered);
  };
  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(songSeleted);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className=" px-10">
      <div className="flex justify-end">
        <Button
          className=" rounded-lg"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
        >
          Find song
        </Button>
      </div>
      {isOpen && (
        <div>
          <Separator className="my-2 h-[1px] bg-zinc-600 rounded-sm" />
          <div className="flex items-center justify-between">
            <h1 className="text-gray-300 font-bold text-2xl mb-5">
              Find a song for your playlist
            </h1>
            <div onClick={() => setIsOpen(false)} className="cursor-pointer">
              <X size={30} />
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <Input placeholder="Name song" onChange={(e) => handleSearch(e)} />
            <div>
              <Search size={30} />
            </div>
          </div>
          <div className="scrollbar overflow-y-scroll">
            {filteredSongs.map((song, idx) => (
              <div
                key={song._id}
                className="flex items-center justify-between p-2 rounded-sm h-18 hover:cursor-pointer"
                onClick={() => {
                  setSongSeleted(song);
                  handlePlay();
                }}
              >
                <div className="font-medium flex items-center gap-4">
                  <div>
                    <img src={song.imageUrl} className="w-14" />
                  </div>
                  <div>
                    <p className="text-xl ">{song.title}</p>
                    <p className="text-xs text-zinc-400">{song.artist.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-zinc-400">
                    {formatTime(song.duration)}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-pointer">
                        <Button variant="ghost">Add</Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to playlist</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HeaderAlbum = () => {
  return (
    <div className="w-full flex justify-between items-center px-10">
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <EllipsisVertical />
            </TooltipTrigger>
            <TooltipContent>
              <p>More option for laylist</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            List <AlignJustify />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              List <AlignJustify />
            </DropdownMenuItem>
            <DropdownMenuItem>
              Grid <List />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MyAlbum;
