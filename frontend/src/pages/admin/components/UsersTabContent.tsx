import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import AddArtistDialog from "./AddArtistDialog";
import UsersTable from "./UsersTable";

const UsersTabContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-500" />
              Users
            </CardTitle>
            <CardDescription>Manage your album collection</CardDescription>
          </div>
          <AddArtistDialog />
        </div>
      </CardHeader>

      <CardContent>
        <UsersTable />
      </CardContent>
    </Card>
  );
};
export default UsersTabContent;
