import { useRef, useState } from "react";
import { Pencil, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { Playlist } from "@/types";

interface EditPlaylistDialogProps {
  playlist: Playlist;
  refreshPlaylist?: () => void;
}

const EditPlaylistDialog = ({
  playlist,
  refreshPlaylist,
}: EditPlaylistDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with existing playlist data
  const [updatedPlaylist, setUpdatedPlaylist] = useState({
    title: playlist.title || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Validate inputs
      if (!updatedPlaylist.title.trim()) {
        return toast.error("Please enter a playlist title");
      }

      const formData = new FormData();
      if (updatedPlaylist.title !== playlist.title) {
        formData.append("title", updatedPlaylist.title);
      }
      if (imageFile) {
        formData.append("avatar", imageFile);
      }

      const response = await axiosInstance.put(
        `admin/playlists/${playlist._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to update playlist");
      }

      setUpdatedPlaylist({ title: playlist.title || "" });
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setDialogOpen(false);
      toast.success("Playlist updated successfully");

      //   refreshPlaylist();
    } catch (error: any) {
      toast.error(
        `Failed to update playlist: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Reset to original playlist data
      setUpdatedPlaylist({ title: playlist.title || "" });
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center hover:text-red-300 hover:bg-gray-400/10 p-2 justify-center rounded-sm"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Playlist</DialogTitle>
          <DialogDescription>
            Update the playlist title and avatar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex items-center justify-center text-center">
              {imageFile ? (
                <div className="space-y-2">
                  <div className="text-sm text-violet-500">Image selected:</div>
                  <div className="text-xs text-zinc-400">
                    {imageFile.name.slice(0, 20)}
                  </div>
                </div>
              ) : (
                <>
                  {playlist.avatar ? (
                    <div>
                      <img
                        src={playlist.avatar}
                        alt={playlist.title || "Playlist avatar"}
                        className="w-[200px] rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                      <Upload className="h-6 w-6 text-zinc-400" />
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="text-xs mt-2">
                    {playlist.avatar
                      ? "Change Avatar"
                      : "Upload Avatar (optional)"}
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Playlist Title</label>
            <Input
              value={updatedPlaylist.title}
              onChange={(e) =>
                setUpdatedPlaylist({
                  ...updatedPlaylist,
                  title: e.target.value,
                })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter playlist title"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-violet-500 hover:bg-violet-600"
            disabled={isLoading || !updatedPlaylist.title.trim()}
          >
            {isLoading ? "Updating..." : "Update Playlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlaylistDialog;
