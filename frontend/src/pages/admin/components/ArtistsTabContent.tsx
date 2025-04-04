import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Library } from "lucide-react";
import AlbumsTable from "./AlbumsTable";
import AddArtistDialog from "./AddArtistDialog";
import ArtistsTable from "./ArtistsTable";

const ArtistsTabContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-violet-500" />
              Artists
            </CardTitle>
            <CardDescription>Manage your album collection</CardDescription>
          </div>
          <AddArtistDialog />
        </div>
      </CardHeader>

      <CardContent>
        <ArtistsTable />
      </CardContent>
    </Card>
  );
};
export default ArtistsTabContent;
