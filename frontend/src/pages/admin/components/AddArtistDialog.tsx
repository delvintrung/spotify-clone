import React, { useRef, useState } from "react";
import { Plus, Upload } from "lucide-react";
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
import { Artist } from "@/types";

const AddArtistDialog = () => {
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newArtist, setNewArtist] = useState<Artist>({
    name: "",
    imageUrl: "",
    birthdate: new Date(),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Chuyển đổi Date thành định dạng yyyy-MM-dd cho input date
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Kiểm tra dữ liệu đầu vào
      if (!newArtist.name.trim()) {
        return toast.error("Please enter an artist name");
      }
      if (!imageFile) {
        return toast.error("Please upload an image");
      }
      if (!newArtist.birthdate) {
        return toast.error("Please select a birthdate");
      }

      const formData = new FormData();
      formData.append("name", newArtist.name);
      formData.append("birthdate", newArtist.birthdate.toISOString());
      formData.append("imageFile", imageFile);

      const res = await axiosInstance.post("/admin/artists", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) {
        throw new Error("Failed to create artist");
      }

      // Reset trạng thái
      setNewArtist({
        name: "",
        imageUrl: "",
        birthdate: new Date(),
      });
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setArtistDialogOpen(false);
      toast.success("Artist created successfully");
    } catch (error: any) {
      toast.error("Failed to create artist: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset trạng thái khi đóng dialog
  const handleDialogClose = (open: boolean) => {
    setArtistDialogOpen(open);
    if (!open) {
      setNewArtist({
        name: "",
        imageUrl: "",
        birthdate: new Date(),
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
      <DialogContent className="bg-zinc-900 border-zinc-700">
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
                  birthdate: new Date(e.target.value),
                })
              }
              className="w-full bg-zinc-800 border-zinc-700 text-white rounded-md p-2"
            />
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
                    Upload artist avatar
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Choose File
                  </Button>
                </>
              )}
            </div>
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
              !imageFile ||
              isNaN(newArtist.birthdate.getTime())
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
