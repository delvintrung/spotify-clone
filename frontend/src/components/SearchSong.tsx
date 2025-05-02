import { useMusicStore } from "@/stores/useMusicStore";
import { Song } from "@/types";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import PremiumWatermark from "./PremiumWatermark";
import PlayButton from "@/pages/home/components/PlayButton";

export const SearchSong = () => {
    const { songs, fetchSongs } = useMusicStore();
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState<Song[]>([]);

    useEffect(() => {
        fetchSongs();
    }, []);

    useEffect(() => {
        const query = searchValue.trim().toLowerCase();
        if (!query) {
            setSearchResults([]);
            return;
        }

        const filtered = songs.filter(
            (song) =>
                song.title?.toLowerCase().includes(query) ||
                song.artist?.name?.toLowerCase().includes(query)
        );
        setSearchResults(filtered);
    }, [searchValue, songs]);

    return (
        <div className="relative w-80">
            {/* Thanh tìm kiếm */}
            <input
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                className="pl-10 pr-4 py-2 bg-zinc-800/50 text-white placeholder-zinc-400 rounded-full 
                focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            />
            <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-5"
            />

            {/* Dropdown kết quả */}
            {searchValue.trim() !== "" && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    <h3 className="text-white text-sm font-semibold px-4 py-2 border-b border-zinc-700">
                        Bài hát
                    </h3>
                    {searchResults.map((song) => (
                        <div
                            key={song._id}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 cursor-pointer relative group"
                        >
                            {song.premium && <PremiumWatermark />}
                            <img
                                src={song.imageUrl}
                                alt={song.title}
                                className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-white text-sm font-medium truncate">{song.title}</p>
                                <p className="text-xs text-zinc-400 truncate">{song.artist?.name}</p>
                            </div>
                            <PlayButton song={song} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
