import { Song } from "../models/song.model.js";
import { Artist } from "../models/artist.model.js";
import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js";
import cloudinary from "../lib/cloudinary.js";
import { clerkClient } from "@clerk/express";
import { Genre } from "../models/genre.model.js";

// helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "songs/source",
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    // if song belongs to an album, update the album's songs array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }
    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    next(error);
  }
};

export const updateSong = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files?.audioFile;
    const imageFile = req.files?.imageFile;

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (audioFile) {
      song.audioUrl = await uploadToCloudinary(audioFile);
    }

    if (imageFile) {
      song.imageUrl = await uploadToCloudinary(imageFile);
    }

    if (title) {
      song.title = title;
    }
    if (artist) {
      song.artist = artist;
    }
    if (duration) {
      song.duration = duration;
    }
    if (albumId) {
      song.albumId = albumId;
    }

    if (albumId && albumId !== song.albumId?.toString()) {
      if (song.albumId) {
        await Album.findByIdAndUpdate(song.albumId, {
          $pull: { songs: song._id },
        });
      }
      await Album.findByIdAndUpdate(albumId, {
        $addToSet: { songs: song._id },
      });

      song.albumId = albumId;
    }

    await song.save();

    res.status(200).json(song);
  } catch (error) {
    console.log("Error in updateSong", error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  }
};

export const createArtist = async (req, res, next) => {
  try {
    const {
      name,
      birthdate,
      "genreIds[]": genreIds,
      description,
      listeners,
      followers,
    } = req.body;
    const { imageFile } = req.files || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Artist name is required" });
    }
    if (!birthdate || isNaN(new Date(birthdate).getTime())) {
      return res.status(400).json({ message: "Valid birthdate is required" });
    }
    if (!description || !description.trim()) {
      return res
        .status(400)
        .json({ message: "Artist description is required" });
    }
    if (!listeners || isNaN(listeners) || listeners < 0) {
      return res
        .status(400)
        .json({ message: "Valid listeners count is required" });
    }
    if (!followers || isNaN(followers) || followers < 0) {
      return res
        .status(400)
        .json({ message: "Valid followers count is required" });
    }
    if (!genreIds || !Array.isArray(genreIds) || genreIds.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one genre is required" });
    }

    const genres = await Genre.find({ _id: { $in: genreIds } });
    if (genres.length !== genreIds.length) {
      return res
        .status(400)
        .json({ message: "One or more genre IDs are invalid" });
    }

    let imageUrl = "";
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile);
    }

    const artist = new Artist({
      name,
      birthdate: new Date(birthdate),
      imageUrl,
      genres: genreIds,
      description,
      listeners: parseInt(listeners),
      followers: parseInt(followers),
    });

    await artist.save();

    res.status(201).json(artist);
  } catch (error) {
    console.error("Error in createArtist:", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const songIds = req.body["songIds[]"] || req.body.songIds;
    const { imageFile } = req.files;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Album title is required" });
    }
    if (!imageFile) {
      return res.status(400).json({ message: "Album artwork is required" });
    }
    if (
      isNaN(releaseYear) ||
      releaseYear < 1900 ||
      releaseYear > new Date().getFullYear()
    ) {
      return res.status(400).json({
        message: "Invalid release year. Must be between 1900 and current year",
      });
    }

    if (!songIds || !Array.isArray(songIds) || songIds.length < 2) {
      return res
        .status(400)
        .json({ message: "At least 2 songs are required for an album" });
    }

    const songs = await Song.find({ _id: { $in: songIds } });
    if (songs.length !== songIds.length) {
      return res
        .status(400)
        .json({ message: "One or more song IDs are invalid" });
    }

    const imageUrl = await uploadToCloudinary(imageFile);

    if (!artist || !artist.trim()) {
      const album = new Album({
        title,
        artist,
        imageUrl,
        releaseYear,
        songs: songIds,
      });

      await album.save();

      res.status(201).json(album);
    } else {
      const album = new Album({
        title,
        imageUrl,
        releaseYear,
        songs: songIds,
      });

      await album.save();

      res.status(201).json(album);
    }
  } catch (error) {
    console.error("Error in createAlbum:", error);
    next(error);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, artist, releaseYear, "songIds[]": songIds } = req.body;
    const { imageFile } = req.files || {};

    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    if (title && !title.trim()) {
      return res.status(400).json({ message: "Album title cannot be empty" });
    }
    if (artist) {
      const artistExists = await Artist.findById(artist);
      if (!artistExists) {
        return res.status(400).json({ message: "Invalid artist ID" });
      }
    }
    if (releaseYear) {
      const year = parseInt(releaseYear);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        return res.status(400).json({
          message: "Release year must be between 1900 and current year",
        });
      }
    }
    if (songIds) {
      if (!Array.isArray(songIds) || songIds.length < 2) {
        return res
          .status(400)
          .json({ message: "At least 2 songs are required for an album" });
      }
      const songs = await Song.find({ _id: { $in: songIds } });
      if (songs.length !== songIds.length) {
        return res
          .status(400)
          .json({ message: "One or more song IDs are invalid" });
      }
    }

    if (title) album.title = title;
    if (artist) album.artist = artist;
    if (releaseYear) album.releaseYear = parseInt(releaseYear);
    if (songIds) album.songs = songIds;
    if (imageFile) {
      album.imageUrl = await uploadToCloudinary(imageFile);
    }

    await album.save();

    // Populate response
    const populatedAlbum = await Album.findById(album._id).populate(
      "songs",
      "title"
    );
    res.status(200).json(populatedAlbum);
  } catch (error) {
    console.error("Error in updateAlbum:", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
};

export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const { avatar } = req.files || {};

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (title && !title.trim()) {
      return res
        .status(400)
        .json({ message: "Playlist title cannot be empty" });
    }

    if (title) playlist.title = title;
    if (avatar) {
      playlist.avatar = await uploadToCloudinary(avatar);
    }

    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error in updatePlaylist:", error);
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Playlist.findByIdAndDelete(id);
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.log("Error in deletePlaylist", error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  const currentUser = await clerkClient.users.getUser(req.auth.userId);
  const isAdmin =
    process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
  if (!isAdmin) {
    return res
      .status(403)
      .json({ admin: false, message: "Unauthorized - you must be an admin" });
  } else {
    return res.status(200).json({ admin: true, message: "You are an admin" });
  }
};
