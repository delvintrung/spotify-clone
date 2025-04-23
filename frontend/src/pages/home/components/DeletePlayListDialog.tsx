import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMusicStore } from "@/stores/useMusicStore";

interface Playlist {
  _id: string;
  title: string;
  avatar?: string;
}

interface DeletePlaylistDialogProps {
  playlist: Playlist;
  refresh?: () => void;
  redirectOnDelete?: boolean;
}

const DeletePlaylistDialog = ({
  playlist,
  refresh,
  redirectOnDelete = false,
}: DeletePlaylistDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.delete(
        `admin/playlists/${playlist._id}`
      );

      if (response.status !== 200 && response.status !== 204) {
        throw new Error(response.data.message || "Failed to delete playlist");
      }

      setDialogOpen(false);
      toast.success("Playlist deleted successfully");

      if (redirectOnDelete) {
        navigate("/");
      } else if (refresh) {
        refresh();
      }
    } catch (error: any) {
      toast.error(
        `Failed to delete playlist: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center hover:text-red-300 hover:bg-gray-400/10 p-2 justify-center rounded-sm"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Delete Playlist</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the playlist{" "}
            <span className="font-semibold text-violet-500">
              "{playlist.title}"
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deleting..." : "Delete Playlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePlaylistDialog;
