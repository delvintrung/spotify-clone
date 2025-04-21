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

const UsersTable = () => {
  const { users, fetchUsers } = useMusicStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Birthdate</TableHead>
          <TableHead>Songs</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user._id} className="hover:bg-zinc-800/50">
              <TableCell>
                <img
                  src={user.imageUrl}
                  alt={user.fullName}
                  className="w-10 h-10 rounded object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{user.fullName}</TableCell>
              {/* <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  {artist.birthdate.toString()}
                </span>
              </TableCell> */}
              {/* <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Music className="h-4 w-4" />
                  {album.songs.length} songs
                </span>
              </TableCell> */}
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    // onClick={() => deleteArtist(artist._id!)}
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
export default UsersTable;
