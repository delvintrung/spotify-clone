import { Song } from "@/types";
import ArtistIntroduce from "./ArtistIntroduce";
import { usePlayerStore } from "@/stores/usePlayerStore";
import VideoPlayer from "./VideoPlayerTag";



const VideoPlayerTab = () => {
  const { currentSong } = usePlayerStore()

  return (
    <div className="relative scrollbar overflow-y-scroll h-full bg-black">
      {/* Tiêu đề */}
      <p className="text-white z-10 px-4 pt-4 text-nowrap">
        {currentSong?.title}
      </p>

      <div className="w-full h-auto">
        <VideoPlayer/>
        
      </div>

      
      <ArtistIntroduce artist={currentSong?.artist} />
    </div>
  );
};

export default VideoPlayerTab;
