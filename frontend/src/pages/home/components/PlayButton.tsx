import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import PayPalButton from "@/components/PaypalButton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const PlayButton = ({ song }: { song: Song }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } =
    usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;
  const [openPaypal, setOpenPaypal] = useState(false);
  console.log("openPaypal", openPaypal);

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  };
  const { isPremium } = useAuthStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          onClick={() => {
            console.log("song.premium", song.premium, isPremium);
            if (song.premium && isPremium === false) {
              console.log("openPaypal");
              setOpenPaypal(true);
            } else {
              handlePlay();
            }
          }}
          className={`absolute bottom-3 right-2 bg-green-500 ${
            song.premium
              ? ``
              : "transition-all hover:bg-green-400  translate-y-2 group-hover:translate-y-0"
          } hover:scale-105  
				 ${isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          {isCurrentSong && isPlaying ? (
            <Pause className="size-5 text-black" />
          ) : (
            <Play className="size-5 text-black" />
          )}
        </Button>
      </DialogTrigger>
      {openPaypal && (
        <DialogContent className="sm:max-w-[425px]">
          <PayPalButton />
        </DialogContent>
      )}
    </Dialog>
  );
};
export default PlayButton;
