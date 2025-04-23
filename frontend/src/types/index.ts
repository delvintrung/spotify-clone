export interface Song {
  _id: string;
  title: string;
  artist: Artist;
  albumId: string | null;
  imageUrl: string;
  audioUrl: string;
  videoUrl?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  premium?: boolean;
}
export interface Artist {
  _id?: string;
  name: string;
  birthdate: Date;
  imageUrl: string;
  description?: string;
  genres?: Genre[];
  listeners?: number;
  followers?: number;
}

export interface Genre {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Playlist {
  _id: string;
  clerkId?: string;
  title: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  songs?: Song[];
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[];
}

export interface Stats {
  totalSongs: number;
  totalAlbums: number;
  totalUsers: number;
  totalArtists: number;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  clerkId: string;
  fullName: string;
  imageUrl: string;
}

export interface Favotite {
  _id: string;
  userId: string;
  songId: Song;
  createdAt?: string;
  updatedAt?: string;
}
