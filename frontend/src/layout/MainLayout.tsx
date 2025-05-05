import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet, useLocation } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";
import VideoPlayer from "./components/VideoPlayerTab";
import FriendsActivity from "./components/FriendsActivity";
import LyricsDisplay from "@/components/LyricsDisplay";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useChatStore } from "@/stores/useChatStoreDjango";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { hasLyrics } = usePlayerStore();
  const { isChatPage, setIsChatPage } = useChatStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    location.pathname === "/chat" ? setIsChatPage(true) : setIsChatPage(false);

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden p-2"
      >
        <AudioPlayer />
        {/* left sidebar */}
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={30}
        >
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          {hasLyrics ? <LyricsDisplay /> : <Outlet />}
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

            {/* right sidebar */}
            <ResizablePanel
              defaultSize={20}
              minSize={0}
              maxSize={25}
              collapsedSize={0}
            >
              {isChatPage ? <FriendsActivity /> : <VideoPlayer />}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <PlaybackControls />
    </div>
  );
};
export default MainLayout;
