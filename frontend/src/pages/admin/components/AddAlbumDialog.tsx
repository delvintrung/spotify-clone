import { useRef, useState } from "react";
import { Plus, Upload, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import toast from "react-hot-toast";

interface Album {
  title: string;
  artist: string; // ID của nghệ sĩ
  releaseYear: number;
  songIds: string[]; // Array of song IDs
}

const AddAlbumDialog = () => {
  const { artists, songs } = useMusicStore();
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newAlbum, setNewAlbum] = useState<Album>({
    title: "",
    artist: "",
    releaseYear: new Date().getFullYear(),
    songIds: [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSongSelect = (songId: string) => {
    if (!newAlbum.songIds.includes(songId)) {
      setNewAlbum({ ...newAlbum, songIds: [...newAlbum.songIds, songId] });
    }
  };

  const handleSongRemove = (songId: string) => {
    setNewAlbum({
      ...newAlbum,
      songIds: newAlbum.songIds.filter((id) => id !== songId),
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Kiểm tra dữ liệu đầu vào
      if (!newAlbum.title.trim()) {
        return toast.error("Please enter an album title");
      }
      if (!newAlbum.artist) {
        return toast.error("Please select an artist");
      }
      if (!imageFile) {
        return toast.error("Please upload an image");
      }
      if (
        isNaN(newAlbum.releaseYear) ||
        newAlbum.releaseYear < 1900 ||
        newAlbum.releaseYear > new Date().getFullYear()
      ) {
        return toast.error(
          `Release year must be between 1900 and ${new Date().getFullYear()}`
        );
      }
      if (newAlbum.songIds.length < 2) {
        return toast.error("Please select at least 2 songs for the album");
      }

      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist", newAlbum.artist);
      formData.append("releaseYear", newAlbum.releaseYear.toString());
      formData.append("imageFile", imageFile);
      newAlbum.songIds.forEach((songId) => {
        formData.append("songIds[]", songId); // Use array notation for songIds
      });

      const res = await axiosInstance.post("/admin/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) {
        throw new Error("Failed to create album");
      }

      // Reset trạng thái
      setNewAlbum({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
        songIds: [],
      });
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setAlbumDialogOpen(false);
      toast.success("Album created successfully");
    } catch (error: any) {
      toast.error("Failed to create album: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset trạng thái khi đóng dialog
  const handleDialogClose = (open: boolean) => {
    setAlbumDialogOpen(open);
    if (!open) {
      setNewAlbum({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
        songIds: [],
      });
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={albumDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button className="bg-violet-500 hover:bg-violet-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Album
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>
            Add a new album to your music collection
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
            <div className="text-center">
              {imageFile ? (
                <div className="space-y-2">
                  <div className="text-sm text-violet-500">Image selected:</div>
                  <div className="text-xs text-zinc-400">
                    {imageFile.name.slice(0, 20)}
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                    <Upload className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-400 mb-2">
                    Upload album artwork
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Album Title</label>
            <Input
              value={newAlbum.title}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter album title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Select
              value={newAlbum.artist}
              onValueChange={(value) =>
                setNewAlbum({ ...newAlbum, artist: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select artist" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="none">Select an artist</SelectItem>
                {artists.map((artist) => (
                  <SelectItem key={artist._id} value={artist._id!}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Songs (Select at least 2)
            </label>
            <Select onValueChange={handleSongSelect}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select songs" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {songs.map((song) => (
                  <SelectItem
                    key={song._id}
                    value={song._id!}
                    disabled={newAlbum.songIds.includes(song._id!)}
                  >
                    {song.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {newAlbum.songIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newAlbum.songIds.map((songId) => {
                  const song = songs.find((s) => s._id === songId);
                  return (
                    <div
                      key={songId}
                      className="flex items-center gap-1 bg-zinc-800 text-zinc-300 text-sm px-2 py-1 rounded-md"
                    >
                      {song?.title}
                      <button
                        onClick={() => handleSongRemove(songId)}
                        className="hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Release Year</label>
            <Input
              type="number"
              value={newAlbum.releaseYear}
              onChange={(e) =>
                setNewAlbum({
                  ...newAlbum,
                  releaseYear: e.target.value
                    ? parseInt(e.target.value)
                    : new Date().getFullYear(),
                })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter release year"
              min={1900}
              max={new Date().getFullYear()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setAlbumDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-violet-500 hover:bg-violet-600"
            disabled={
              isLoading ||
              !newAlbum.title.trim() ||
              !newAlbum.artist ||
              !imageFile ||
              newAlbum.songIds.length < 2 ||
              isNaN(newAlbum.releaseYear) ||
              newAlbum.releaseYear < 1900 ||
              newAlbum.releaseYear > new Date().getFullYear()
            }
          >
            {isLoading ? "Creating..." : "Add Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlbumDialog;
