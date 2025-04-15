import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";

export const createPlaylist = async (req, res, next) => {
  try {
    const { title, clerkId } = req.body;
    const playlist = new Playlist({
      title,
      clerkId,
    });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const getPlaylists = async (req, res, next) => {
  try {
    const { clerkId } = req.query;
    const playlists = await Playlist.find({ clerkId }).populate("songs");
    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistsById = async (req, res, next) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId).populate("songs");
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    playlist.songs.push(song._id);
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};
