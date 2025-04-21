import { Favotite, Song } from "@/types";
import { useState, useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";

import { Play } from "lucide-react";

import ButtonPlayCustom from "@/pages/home/components/ButtonPlayCustom";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const ListSong = ({ id }: { id: string }) => {
  const {
    fetchFavoritesByArtistId,
  }: { fetchFavoritesByArtistId: (id: string) => Promise<Favotite[]> } =
    useMusicStore();

  const { currentSong, setCurrentSong, togglePlay } = usePlayerStore();

  const [songSeleted, setSongSeleted] = useState<Song | null>(null);
  const [favorites, setFavorites] = useState<Favotite[]>([]);
  const [isIconHidden, setIsIconHidden] = useState(true);
  const isCurrentSong = currentSong?._id === songSeleted?._id;
  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await fetchFavoritesByArtistId(id);
      setFavorites(response);
    };
    fetchFavorites();
  }, [id]);

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(songSeleted);
  };
  return (
    <div className="p-10 w-[900px]">
      <div>
        <p>Favorite songs</p>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableBody className="w-[800px]">
          {favorites.map((favourite) => (
            <TableRow
              key={favourite._id}
              className="flex items-center justify-between px-4 rounded-sm hover:cursor-pointer"
              onMouseOver={() => setIsIconHidden(false)}
              onMouseLeave={() => setIsIconHidden(true)}
              onClick={() => {
                setSongSeleted(favourite.songId);
                handlePlay();
              }}
            >
              <TableCell className="font-medium flex items-center gap-4 relative">
                <div className="w-10 h-10 absolute top-5 left-0">
                  <ButtonPlayCustom song={favourite.songId} />
                </div>
                <div className="pl-10">
                  <img src={favourite.songId.imageUrl} className="w-14" />
                </div>
                <div>
                  <p className="text-xl ">{favourite.songId.title}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs text-zinc-400">
                  {formatTime(favourite.songId.duration)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListSong;
