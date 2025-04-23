import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext, isRepeat } = usePlayerStore();

  // handle play/pause logic
  useEffect(() => {
    if (isPlaying) videoRef.current?.play();
    else videoRef.current?.pause();
  }, [isPlaying]);

  // handle song ends
  useEffect(() => {
    const audio = videoRef.current;

    const handleEnded = () => {
      if (isRepeat) {
        console.log(videoRef.current);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
      } else {
        playNext();
      }
    };

    audio?.addEventListener("ended", handleEnded);

    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext, isRepeat]);

  // handle song changes
  useEffect(() => {
    if (!videoRef.current || !currentSong) return;

    const audio = videoRef.current;

    // check if this is actually a new song
    const isSongChange = prevSongRef.current !== currentSong?.videoUrl;
    if (isSongChange) {
      audio.src = currentSong?.videoUrl!;
      // reset the playback position
      audio.currentTime = 0;

      prevSongRef.current = currentSong?.audioUrl;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  return <video ref={videoRef} className="w-full h-screen object-cover rounded-lg absolute top-0 left-0 min-w-[250px]" />;
};
export default VideoPlayer;
