import { useEffect, useRef, useState } from "react";
import { Pencil, Upload, X } from "lucide-react";
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
import toast from "react-hot-toast";
import { Artist } from "@/types";
import { useMusicStore } from "@/stores/useMusicStore";

interface EditArtistDialogProps {
  currentArtist: Artist;
  refreshTable: () => void;
}

const EditArtistDialog = ({
  currentArtist,
  refreshTable,
}: EditArtistDialogProps) => {
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [updatedArtist, setUpdatedArtist] = useState({
    name: currentArtist.name || "",
    birthdate: currentArtist.birthdate
      ? new Date(currentArtist.birthdate)
      : new Date(),
    imageUrl: currentArtist.imageUrl || "",
    genreIds: currentArtist.genres?.map((g) => g._id) || [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const { genres, fetchGenres } = useMusicStore();

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
    if (!updatedArtist.genreIds.includes(genreId)) {
      setUpdatedArtist({
        ...updatedArtist,
        genreIds: [...updatedArtist.genreIds, genreId],
      });
    }
  };

  const handleGenreRemove = (genreId: string) => {
    setUpdatedArtist({
      ...updatedArtist,
      genreIds: updatedArtist.genreIds.filter((id) => id !== genreId),
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Validate inputs
      if (!updatedArtist.name.trim()) {
        return toast.error("Please enter an artist name");
      }
      if (isNaN(updatedArtist.birthdate.getTime())) {
        return toast.error("Please select a valid birthdate");
      }
      if (updatedArtist.genreIds.length === 0) {
        return toast.error("Please select at least one genre");
      }

      const formData = new FormData();

      // Only append changed fields
      if (updatedArtist.name !== currentArtist.name) {
        formData.append("name", updatedArtist.name);
      }
      if (
        updatedArtist.birthdate.toISOString() !==
        new Date(currentArtist.birthdate).toISOString()
      ) {
        formData.append("birthdate", updatedArtist.birthdate.toISOString());
      }
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      updatedArtist.genreIds.forEach((genreId) => {
        formData.append("genreIds[]", genreId);
      });

      const res = await axiosInstance.put(
        `/admin/artists/${currentArtist._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to update artist");
      }

      // Reset state
      setUpdatedArtist({
        name: currentArtist.name || "",
        birthdate: currentArtist.birthdate
          ? new Date(currentArtist.birthdate)
          : new Date(),
        imageUrl: currentArtist.imageUrl || "",
        genreIds: currentArtist.genres?.map((g) => g._id) || [],
      });
      setImageFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      setArtistDialogOpen(false);
      toast.success("Artist updated successfully");
      refreshTable();
    } catch (error: any) {
      toast.error(
        `Failed to update artist: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setArtistDialogOpen(open);
    if (!open) {
      setUpdatedArtist({
        name: currentArtist.name || "",
        birthdate: currentArtist.birthdate
          ? new Date(currentArtist.birthdate)
          : new Date(),
        imageUrl: currentArtist.imageUrl || "",
        genreIds: currentArtist.genres?.map((g) => g._id) || [],
      });
      setImageFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={artistDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <div className="flex items-center hover:text-red-300 hover:bg-gray-400/10 p-2 justify-center rounded-sm cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
        </div>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Artist</DialogTitle>
          <DialogDescription>
            Update artist details and genres.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageSelect}
          />

          {/* Image upload area */}
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
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
                  {updatedArtist.imageUrl ? (
                    <div>
                      <img
                        src={updatedArtist.imageUrl}
                        alt={updatedArtist.name || "Artist avatar"}
                        className="w-[200px] rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                      <Upload className="h-6 w-6 text-zinc-400" />
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="text-xs mt-2">
                    {updatedArtist.imageUrl
                      ? "Change Avatar"
                      : "Upload Avatar (optional)"}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Artist fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={updatedArtist.name}
              onChange={(e) =>
                setUpdatedArtist({ ...updatedArtist, name: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter artist name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Birthdate</label>
            <input
              type="date"
              value={formatDateForInput(updatedArtist.birthdate)}
              onChange={(e) =>
                setUpdatedArtist({
                  ...updatedArtist,
                  birthdate: e.target.value
                    ? new Date(e.target.value)
                    : updatedArtist.birthdate,
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
                {genres.map((genre) => (
                  <SelectItem
                    key={genre._id}
                    value={genre._id}
                    disabled={updatedArtist.genreIds.includes(genre._id)}
                  >
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {updatedArtist.genreIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {updatedArtist.genreIds.map((genreId) => {
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
              !updatedArtist.name.trim() ||
              isNaN(updatedArtist.birthdate.getTime()) ||
              updatedArtist.genreIds.length === 0
            }
          >
            {isLoading ? "Updating..." : "Update Artist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditArtistDialog;
