import ArtistIntroduce from "./ArtistIntroduce";

const VideoPlayer = () => {
  return (
    <div className="relative scrollbar overflow-y-scroll h-full">
      <p className="text-white z-10 absolute top-4 px-2 text-nowrap">
        Music name
      </p>
      <video
        controls
        autoPlay
        poster="/screenshot-for-readme.png"
        className="w-full h-screen object-cover absolute top-0 left-0 rounded-lg"
      >
        <source src="/videos/sunflower.mp4" type="video/mp4" />
        <source src="/public/videos/sunflower.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <ArtistIntroduce />
    </div>
  );
};

export default VideoPlayer;
