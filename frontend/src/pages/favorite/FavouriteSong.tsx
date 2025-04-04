import Topbar from "@/components/Topbar";
import ListSong from "./components/ListSong";
import { useUser } from "@clerk/clerk-react";
const FavouriteSong = () => {
  const { user, isSignedIn } = useUser();
  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar />

      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <div className="flex flex-col h-full">
          {isSignedIn && <ListSong id={user.id} />}
        </div>
      </div>
    </main>
  );
};

export default FavouriteSong;
