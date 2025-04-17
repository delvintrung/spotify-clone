import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";

const ButtonPlayCustom = ({ song }: { song: Song }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } =
    usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  };

  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      onClick={handlePlay}
      className={`absolute bottom-3 right-2 ${
        song.premium
          ? "opacity-0"
          : "transition-all opacity-0 translate-y-2 group-hover:translate-y-0"
      } hover:scale-105`}
      disabled={song.premium ? true : false}
    >
      {isCurrentSong && isPlaying ? (
        <Pause color="#ffffff" className="size-5 text-white " />
      ) : (
        <Play color="#ffffff" className="size-5 text-white" />
      )}
    </Button>
  );
};
export default ButtonPlayCustom;
