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
import { Album, Song } from "@/types";
import { Textarea } from "flowbite-react";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { isObject } from "util";

interface NewSong {
  title: string;
  artist: string;
  album: string;
  duration: string;
  lyrics?: string;
}

interface EditSongDialogProps {
  currentSong: Song;
}

const EditSongDialog = ({ currentSong }: EditSongDialogProps) => {
  const { albums, artists, fetchSongs } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Khởi tạo newSong với giá trị từ currentSong
  const [newSong, setNewSong] = useState<NewSong>({
    title: currentSong.title,
    artist: currentSong.artist._id ?? "",
    album: currentSong.albumId ?? "none",
    duration: currentSong.duration?.toString() ?? "0",
  });

  const [files, setFiles] = useState<{
    audio: File | null;
    image: File | null;
  }>({
    audio: null,
    image: null,
  });

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Chỉ thêm các trường đã thay đổi
      if (newSong.title !== currentSong.title) {
        formData.append("title", newSong.title);
      }
      if (newSong.artist !== (currentSong.artist._id ?? "")) {
        formData.append("artist", newSong.artist);
      }
      if (newSong.duration !== currentSong.duration?.toString()) {
        formData.append("duration", newSong.duration);
      }
      if (newSong.lyrics !== currentSong.lyrics) {
        formData.append("lyrics", newSong.lyrics || "");
      }
      if (
        newSong.album !== (currentSong.albumId ?? "none") &&
        newSong.album !== "none"
      ) {
        formData.append("albumId", newSong.album);
      }

      // Chỉ thêm file nếu người dùng chọn file mới
      if (files.audio) {
        formData.append("audioFile", files.audio);
      }
      if (files.image) {
        formData.append("imageFile", files.image);
      }

      const res = await axiosInstance.put(
        `/admin/songs/${currentSong._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status !== 200) {
        throw new Error("Failed to edit song");
      }

      // Reset trạng thái
      setNewSong({
        title: currentSong.title,
        artist: currentSong.artist._id ?? "",
        album: currentSong.albumId ?? "none",
        duration: currentSong.duration?.toString() ?? "0",
      });
      setFiles({
        audio: null,
        image: null,
      });
      setSongDialogOpen(false);
      toast.success("Song edited successfully");
      fetchSongs();
    } catch (error: any) {
      toast.error("Failed to edit song: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset trạng thái khi đóng dialog
  const handleDialogClose = (open: boolean) => {
    setSongDialogOpen(open);
    if (!open) {
      setNewSong({
        title: currentSong.title,
        artist: currentSong.artist._id ?? "",
        album: currentSong.albumId ?? "none",
        duration: currentSong.duration?.toString() ?? "0",
      });
      setFiles({
        audio: null,
        image: null,
      });
      if (audioInputRef.current) audioInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={songDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <div className="flex items-center hover:text-red-300 hover:bg-gray-400/10 p-2 justify-center rounded-sm cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
        </div>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Song</DialogTitle>
          <DialogDescription>
            Edit song details and upload new files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            type="file"
            accept="audio/*"
            ref={audioInputRef}
            hidden
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))
            }
          />

          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, image: e.target.files![0] }))
            }
          />

          {/* Image upload area */}
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
          >
            <div className="text-center">
              {files.image ? (
                <div className="space-y-2">
                  <div className="text-sm text-emerald-500">
                    Image selected:
                  </div>
                  <div className="text-xs text-zinc-400">
                    {files.image.name.slice(0, 20)}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <img
                      src={currentSong.imageUrl}
                      alt={currentSong.title}
                      className="w-[200px]"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="text-xs mt-2">
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Audio upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Audio File</label>
            <div className="flex flex-col justify-center items-center gap-5">
              {!files.audio && (
                <audio src={currentSong.audioUrl} controls className="h-10" />
              )}
              <Button
                variant="outline"
                onClick={() => audioInputRef.current?.click()}
                className="w-full"
              >
                {files.audio
                  ? files.audio.name.slice(0, 20)
                  : "Choose Another Audio File"}
              </Button>
            </div>
          </div>

          {/* Other fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={newSong.title}
              onChange={(e) =>
                setNewSong({ ...newSong, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Select
              value={newSong.artist}
              onValueChange={(value) =>
                setNewSong({ ...newSong, artist: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select artist" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="none">Không biết</SelectItem>
                {artists.map((artist) => (
                  <SelectItem key={artist._id} value={artist._id!}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (seconds)</label>
            <Input
              type="number"
              min="0"
              value={newSong.duration}
              onChange={(e) =>
                setNewSong({ ...newSong, duration: e.target.value || "0" })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Album (Optional)</label>
            <Select
              value={newSong.album}
              onValueChange={(value) =>
                setNewSong({ ...newSong, album: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select album" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="none">No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Lyrics (Optional)</label>
            <Textarea
              value={newSong.lyrics}
              onChange={(e) =>
                setNewSong({ ...newSong, lyrics: e.target.value || "0" })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setSongDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Edit Song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSongDialog;
