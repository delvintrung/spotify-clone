import ArtistIntroduce from "./ArtistIntroduce";
import { usePlayerStore } from "@/stores/usePlayerStore";
import VideoPlayer from "./VideoPlayerTag";

const VideoPlayerTab = () => {
  const { currentSong } = usePlayerStore();

  return (
    <div className="relative scrollbar overflow-y-scroll h-full bg-black">
      <p className="text-white z-10 px-4 pt-4 text-nowrapp relative ">
        {currentSong?.title}
      </p>

      <div className="w-full h-auto">
        {currentSong?.videoUrl ? (
          <VideoPlayer />
        ) : (
          <img
            src="/cover-images/HD-wallpaper-spotify.jpg"
            alt="Song"
            className="w-full h-screen object-cover rounded-lg absolute top-0 left-0 min-w-[250px] z-0"
          />
        )}
      </div>

      <ArtistIntroduce artist={currentSong?.artist} />
    </div>
  );
};

export default VideoPlayerTab;
