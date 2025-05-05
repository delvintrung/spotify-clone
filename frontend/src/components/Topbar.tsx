import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import BuyPremiumButton from "./BuyPremiumButton";
import PremiumCircle from "./PremiumCircle";
import { useUser } from "@clerk/clerk-react";
import { SearchSong } from "./SearchSong";

const Topbar = () => {
  const { isAdmin, isPremium } = useAuthStore();
  const { isSignedIn } = useUser();
  return (
    <div
      className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10"
    >
      <div className="flex items-center gap-2">
        <img src="/spotify.png" className="size-8" alt="Spotify logo" />
        <span className="text-white font-bold">Spotify</span>
      </div>
      <div className="flex items-center gap-4">
        <SearchSong />
        {isSignedIn && <BuyPremiumButton isPremium={isPremium} />}
        {isAdmin && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}
        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>
        <div className="relative">
          {isPremium && <PremiumCircle />}
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
