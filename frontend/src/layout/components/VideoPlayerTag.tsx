import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext, isRepeat } = usePlayerStore();

  useEffect(() => {
    if (isPlaying) videoRef.current?.play();
    else videoRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;

    const handleEnded = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    };

    video?.addEventListener("ended", handleEnded);

    return () => video?.removeEventListener("ended", handleEnded);
  }, [playNext, isRepeat]);

  // handle song changes
  useEffect(() => {
    if (!videoRef.current || !currentSong) return;

    const audio = videoRef.current;
    const isSongChange = prevSongRef.current !== currentSong?.videoUrl;
    if (isSongChange) {
      audio.src = currentSong?.videoUrl!;
      audio.currentTime = 0;

      prevSongRef.current = currentSong?.audioUrl;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  return (
    <video
      ref={videoRef}
      className="w-full h-screen object-cover rounded-lg absolute top-0 left-0 min-w-[250px]"
    />
  );
};
export default VideoPlayer;
