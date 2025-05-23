import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn, useUser } from "@clerk/clerk-react";
import {
  HomeIcon,
  Library,
  MessageCircle,
  Star,
  CirclePlus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const {
    albums,
    currentPlaylist,
    playlists,
    fetchAlbums,
    fetchPlaylists,
    isLoading,
  } = useMusicStore();
  const { user } = useUser();

  useEffect(() => {
    fetchAlbums();
    fetchPlaylists(user?.id!);
  }, [fetchAlbums, fetchPlaylists]);

  useEffect(() => {
    if (currentPlaylist) {
      fetchPlaylists(user?.id!);
    }
  }, [currentPlaylist, user?.id]);

  const handleCreatePlaylist = () => {
    axiosInstance
      .post("/playlists/create", {
        title: `Playlist ${user?.fullName!}`,
        clerkId: user?.id,
      })
      .then(() => {
        fetchAlbums();
        fetchPlaylists(user?.id!);
        toast.success("Playlist created successfully");
      })
      .catch((error) => {
        console.error("Error creating playlist:", error);
      });
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}

      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link
              to={"/favourite"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <Star className="mr-2 size-5" />
              <span className="hidden md:inline">Favourite</span>
            </Link>
          </SignedIn>

          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <MessageCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Library section */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline">Playlists</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={handleCreatePlaylist}>
                <CirclePlus />
              </TooltipTrigger>
              <TooltipContent>
                <p>Create album</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <ScrollArea className="">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              playlists.map((playlist) => (
                <Link
                  to={`/playlists/${playlist._id}`}
                  key={playlist._id}
                  className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src={playlist.avatar}
                    alt="Playlist img"
                    className="size-12 rounded-md flex-shrink-0 object-cover"
                  />

                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate">{playlist.title}</p>
                    <p className="text-sm text-zinc-400 truncate">
                      Album • {user?.fullName}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src={album.imageUrl}
                    alt="Playlist img"
                    className="size-12 rounded-md flex-shrink-0 object-cover"
                  />

                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate">{album.title}</p>
                    <p className="text-sm text-zinc-400 truncate">
                      Album • {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default LeftSidebar;
