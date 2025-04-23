import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Trash2 } from "lucide-react";
import { useEffect } from "react";
import EditArtistDialog from "./EditArtistDialog";

function formatVietnamDate(isoString: string) {
  const date = new Date(isoString);
  const vietnamOffset = 7 * 60;
  const localDate = new Date(date.getTime() + vietnamOffset * 60 * 1000);

  const day = localDate.getDate().toString().padStart(2, "0");
  const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
  const year = localDate.getFullYear();

  return `${day}/${month}/${year}`;
}

const ArtistsTable = () => {
  const { artists, deleteArtist, fetchArtists } = useMusicStore();

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Birthdate</TableHead>
          <TableHead>Genres</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {artists.length > 0 ? (
          artists.map((artist) => (
            <TableRow key={artist._id} className="hover:bg-zinc-800/50">
              <TableCell>
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-10 h-10 rounded object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{artist.name}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  {formatVietnamDate(artist.birthdate.toString())}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  {artist.genres?.map((gen) => (
                    <span key={gen._id} className="text-sm text-zinc-400">
                      ,{gen.name}
                    </span>
                  ))}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <EditArtistDialog
                    currentArtist={artist}
                    refreshTable={() => fetchArtists()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteArtist(artist._id!)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <div>Chua co album nao</div>
        )}
      </TableBody>
    </Table>
  );
};
export default ArtistsTable;
