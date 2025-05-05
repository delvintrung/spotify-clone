import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";

const parseLRC = (lrcString: string) => {
  if (!lrcString) return [];
  const lines = lrcString.split("\n");
  const parsedLyrics = lines
    .map((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d{2,3})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseFloat(match[2]);
        const time = minutes * 60 + seconds;
        const text = match[3].trim() || " ";
        return { time, text };
      }
      return null;
    })
    .filter(Boolean);
  return parsedLyrics;
};

const LyricsDisplay = () => {
  const { currentSong } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState(0);
  const lyrics = parseLRC(currentSong?.lyrics || "");
  const lyricsRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const audio = document.querySelector("audio");
    audioRef.current = audio;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      audio.addEventListener("timeupdate", updateTime);
      return () => audio.removeEventListener("timeupdate", updateTime);
    }
  }, []);

  // Tìm dòng hiện tại
  const currentLyric = lyrics.find(
    (lyric, index) =>
      lyric?.time !== undefined &&
      lyric.time <= currentTime &&
      (index === lyrics.length - 1 ||
        (lyrics[index + 1]?.time ?? Infinity) > currentTime)
  );

  // Cuộn đến dòng hiện tại
  useEffect(() => {
    if (currentLyric && lyricsRef.current && scrollAreaRef.current) {
      const activeElement =
        lyricsRef.current.querySelector(".lyric-line.active");
      if (activeElement) {
        const scrollArea = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollArea) {
          const elementTop = activeElement.getBoundingClientRect().top;
          const scrollAreaTop = scrollArea.getBoundingClientRect().top;
          const scrollAreaHeight = scrollArea.getBoundingClientRect().height;
          const offset =
            elementTop -
            scrollAreaTop -
            scrollAreaHeight / 2 +
            activeElement.getBoundingClientRect().height / 2;
          scrollArea.scrollTo({
            top: scrollArea.scrollTop + offset,
            behavior: "smooth",
          });
        }
      }
    }
  }, [currentLyric]);

  if (!currentSong || !lyrics.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-zinc-900/50 rounded-lg text-zinc-400">
        Không có lời bài hát
      </div>
    );
  }

  return (
    <div className="w-full h-full mx-auto p-6 bg-zinc-900/70 backdrop-blur-md rounded-xl border border-zinc-700/50 shadow-2xl transition-all duration-300">
      <style>
        {`
          @keyframes text-reveal {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          .lyric-line.active {
            background: linear-gradient(
              to right,
              #22c55e 20%,
              #4ade80 40%,
              #4ade80 60%,
              #22c55e 80%
            );
            background-size: 200% auto;
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            animation: text-reveal 2s linear;
          }
        `}
      </style>
      <h2 className="text-xl font-bold text-white mb-6 tracking-tight">
        Lời bài hát: {currentSong.title}
      </h2>
      <ScrollArea
        className="h-full rounded-lg bg-zinc-800/50"
        ref={scrollAreaRef}
      >
        <div ref={lyricsRef} className="px-6 py-4">
          {lyrics.map((lyric, index) => (
            <p
              key={index}
              className={`lyric-line text-lg px-4 mb-4 transition-all zaczął: true;
              duration-300 tracking-wide ${
                currentLyric && currentLyric.time === lyric?.time
                  ? "font-semibold scale-105 active"
                  : "text-zinc-300/80 hover:text-zinc-100"
              }`}
            >
              {lyric?.text}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LyricsDisplay;
