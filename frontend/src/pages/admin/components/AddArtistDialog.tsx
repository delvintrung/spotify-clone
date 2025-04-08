import React from "react";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
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
  const [date, setDate] = React.useState<Date>();

  const [newArtist, setNewArtist] = useState<Artist>({
    name: "",
    imageUrl: "",
    birthdate: date || new Date(),
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
      if (!imageFile) {
        return toast.error("Please upload an image");
      }

      const formData = new FormData();
      formData.append("name", newArtist.name);
      formData.append("birthdate", newArtist.birthdate.toString());
      formData.append("imageFile", imageFile);

      await axiosInstance.post("/admin/artists", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewArtist({
        name: "",
        imageUrl: "",
        birthdate: new Date(),
      });
      setImageFile(null);
      setArtistDialogOpen(false);
      toast.success("Album created successfully");
    } catch (error: any) {
      toast.error("Failed to create album: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={artistDialogOpen} onOpenChange={setArtistDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-500 hover:bg-violet-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Artist
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle>Add New Artist</DialogTitle>
          <DialogDescription>Add a new artsist</DialogDescription>
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
              placeholder="Enter name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Birthdate</label>
            <input
              type="date"
              name=""
              id=""
              className="bg-zinc-900 ml-2 rounded-sm"
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
              <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                <Upload className="h-6 w-6 text-zinc-400" />
              </div>
              <div className="text-sm text-zinc-400 mb-2">
                {imageFile ? imageFile.name : "Upload artsist avatar"}
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Choose File
              </Button>
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
            disabled={isLoading || !imageFile || !newArtist.name || !date}
          >
            {isLoading ? "Creating..." : "Add Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddArtistDialog;
