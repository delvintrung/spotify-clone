import { useEffect, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Artist } from "@/types";
import { useMusicStore } from "@/stores/useMusicStore";
import { axiosInstance } from "@/lib/axios";

interface AddArtistDialogProps {
  refreshTable: () => void;
}

const AddArtistDialog = ({ refreshTable }: AddArtistDialogProps) => {
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { genres, fetchGenres } = useMusicStore();

  const [newArtist, setNewArtist] = useState<
    Omit<Artist, "genres"> & { genres: string[] }
  >({
    name: "",
    birthdate: new Date(),
    imageUrl: "",
    genres: [],
    description: "",
    listeners: 0,
    followers: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleGenreSelect = (genreId: string) => {
    if (!newArtist.genres.includes(genreId)) {
      setNewArtist({
        ...newArtist,
        genres: [...(newArtist.genres || []), genreId],
      });
    }
  };

  const handleGenreRemove = (genreId: string) => {
    setNewArtist({
      ...newArtist,
      genres: newArtist.genres?.filter((id) => id !== genreId) || [],
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!newArtist.name.trim()) {
        return toast.error("Please enter an artist name");
      }
      if (isNaN(newArtist.birthdate.getTime())) {
        return toast.error("Please select a valid birthdate");
      }
      if (!newArtist.genres || newArtist.genres.length === 0) {
        return toast.error("Please select at least one genre");
      }
      if (newArtist.followers! < 0) {
        return toast.error("Followers cannot be negative");
      }
      if (newArtist.listeners! < 0) {
        return toast.error("Listeners cannot be negative");
      }
      if (!newArtist.description?.trim()) {
        return toast.error("Description cannot exceed 500 characters");
      }

      const formData = new FormData();
      formData.append("name", newArtist.name);
      formData.append("birthdate", newArtist.birthdate.toISOString());
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      newArtist.genres.forEach((genreId) => {
        formData.append("genreIds[]", genreId);
      });
      formData.append("description", newArtist.description || "");
      formData.append("followers", newArtist.followers?.toString() || "0");
      formData.append("listeners", newArtist.listeners?.toString() || "0");

      const res = await axiosInstance.post("/admin/artists", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 201) {
        throw new Error(res.data.message || "Failed to create artist");
      }

      setNewArtist({
        name: "",
        birthdate: new Date(),
        imageUrl: "",
        genres: [],
        description: "",
        listeners: 0,
        followers: 0,
      });
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setArtistDialogOpen(false);
      toast.success("Artist created successfully");
      refreshTable();
    } catch (error: any) {
      toast.error(
        `Failed to create artist: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setArtistDialogOpen(open);
    if (!open) {
      setNewArtist({
        name: "",
        birthdate: new Date(),
        imageUrl: "",
        genres: [],
        description: "",
        listeners: 0,
        followers: 0,
      });
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={artistDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button className="bg-violet-500 hover:bg-violet-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Artist
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Artist</DialogTitle>
          <DialogDescription>
            Add a new artist to your music library
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist Name</label>
            <Input
              value={newArtist.name}
              onChange={(e) =>
                setNewArtist({ ...newArtist, name: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter artist name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Birthdate</label>
            <input
              type="date"
              value={formatDateForInput(newArtist.birthdate)}
              onChange={(e) =>
                setNewArtist({
                  ...newArtist,
                  birthdate: e.target.value
                    ? new Date(e.target.value)
                    : newArtist.birthdate,
                })
              }
              className="w-full bg-zinc-800 border-zinc-700 text-white rounded-md p-2"
              max={formatDateForInput(new Date())} // Prevent future dates
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Genres (Select at least one)
            </label>
            <Select onValueChange={handleGenreSelect}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select genres" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {genres?.map((genre) => (
                  <SelectItem
                    key={genre._id}
                    value={genre._id}
                    disabled={newArtist.genres.includes(genre._id)}
                  >
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {newArtist.genres && newArtist.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newArtist.genres.map((genreId) => {
                  const genre = genres.find((g) => g._id === genreId);
                  return (
                    <div
                      key={genreId}
                      className="flex items-center gap-1 bg-zinc-800 text-zinc-300 text-sm px-2 py-1 rounded-md"
                    >
                      {genre?.name || "Unknown Genre"}
                      <button
                        onClick={() => handleGenreRemove(genreId)}
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
                    Upload artist avatar (optional)
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={newArtist.description}
              onChange={(e) =>
                setNewArtist({ ...newArtist, description: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter description"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Followers: </label>
            <Input
              value={newArtist.followers}
              onChange={(e) =>
                setNewArtist({
                  ...newArtist,
                  followers: parseInt(e.target.value) || 0,
                })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter followers"
              type="number"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Listeners</label>
            <Input
              value={newArtist.listeners}
              onChange={(e) =>
                setNewArtist({
                  ...newArtist,
                  listeners: parseInt(e.target.value) || 0,
                })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter listeners"
              type="number"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setArtistDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-violet-500 hover:bg-violet-600"
            disabled={
              isLoading ||
              !newArtist.name.trim() ||
              isNaN(newArtist.birthdate.getTime()) ||
              !newArtist.genres ||
              newArtist.genres.length === 0
            }
          >
            {isLoading ? "Creating..." : "Add Artist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddArtistDialog;
