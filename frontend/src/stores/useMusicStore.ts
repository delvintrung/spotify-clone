import { axiosInstance } from "@/lib/axios";
import {
  Album,
  Artist,
  Favotite,
  Song,
  Stats,
  Playlist,
  User,
  Genre,
} from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  users: User[];
  favorites: Favotite[];
  playlists: Playlist[];
  genres: Genre[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  currentPlaylist: Playlist | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchPlaylists: (clerkId: string) => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchArtists: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchFavoritesByArtistId: (id: string) => Promise<Favotite[]>;
  fetchGenres: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteArtist: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  addToFavorites: (songId: string, clerkId: string) => Promise<void>;
  removeFromFavorites: (songId: string, clerkId: string) => Promise<void>;
  fetchPlaylistById: (playlistId: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  artists: [],
  favorites: [],
  songs: [],
  users: [],
  playlists: [],
  genres: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  currentPlaylist: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`); //

      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      console.log("Error in deleteSong", error);
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => a._id === id)?.title
            ? { ...song, album: null }
            : song
        ),
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete album: " + error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteArtist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/artists/delete/${id}`);
      set((state) => ({
        artists: state.artists.filter((artist) => artist._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => a._id === id)?.title
            ? { ...song, album: null }
            : song
        ),
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete album: " + error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylists: async (clerkId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/playlist?clerkId=${clerkId}`);
      set({ playlists: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchArtists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/artists");
      set({ artists: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFavoritesByArtistId: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/favorites/favorite?clerkId=${id}`
      );
      set({ favorites: response.data });
      return response.data;
    } catch (error: any) {
      set({ error: error.response.data.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchGenres: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/genres");
      set({ genres: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addToFavorites: async (songId, clerkId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/favorites/add", {
        songId,
        clerkId,
      });
      set((state) => ({
        favorites: [...state.favorites, response.data],
      }));
      toast.success("Added to favorites");
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromFavorites: async (songId, clerkId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete("/favorites/remove", {
        data: { songId, clerkId },
      });
      set((state) => ({
        favorites: state.favorites.filter(
          (favorite) => favorite.songId._id !== songId
        ),
      }));
      toast.success("Removed from favorites");
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPlaylistById: async (playlistId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/playlist/${playlistId}`);
      set({ currentPlaylist: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
