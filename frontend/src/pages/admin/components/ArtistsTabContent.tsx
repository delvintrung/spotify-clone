import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil } from "lucide-react";
import AddArtistDialog from "./AddArtistDialog";
import ArtistsTable from "./ArtistsTable";
import { useMusicStore } from "@/stores/useMusicStore";

const ArtistsTabContent = () => {
  const { fetchArtists } = useMusicStore();

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-violet-500" />
              Artists
            </CardTitle>
            <CardDescription>Manage your album collection</CardDescription>
          </div>
          <AddArtistDialog refreshTable={() => fetchArtists()} />
        </div>
      </CardHeader>

      <CardContent>
        <ArtistsTable />
      </CardContent>
    </Card>
  );
};
export default ArtistsTabContent;
