import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Favorite } from "../models/favorite.model.js";

export const getFavoriteById = async (req, res, next) => {
  try {
    // -1 = Descending => newest -> oldest
    // 1 = Ascending => oldest -> newest
    const userId = req.query.userId;

    const favorites = await Favorite.find({ clerkId: userId })
      .populate("songId")
      .sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

export const addToFavorite = async (req, res, next) => {
  try {
    const { clerkId, songId } = req.body;
    console.log("addToFavorite", clerkId, songId);

    const existingFavorite = await Favorite.findOne({
      clerkId,
      songId,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Song already in favorites" });
    }

    const favorite = new Favorite({
      clerkId,
      songId,
    });

    await favorite.save();

    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { songId, userId } = req.body;
    const existingFavorite = await Favorite.findOne({
      clerkId: userId,
      songId,
    });
    if (!existingFavorite) {
      return res.status(404).json({ message: "Favorite not found" });
    } else {
      await Favorite.deleteOne({ clerkId: userId, songId });
      return res.status(200).json({ message: "Favorite removed" });
    }
  } catch (error) {
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $lookup: {
          from: "artists",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: { $arrayElemAt: ["$artist", 0] },
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $lookup: {
          from: "artists",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: { $arrayElemAt: ["$artist", 0] },
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const createArtist = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { name, birthdate } = req.body;
    const imageFile = req.files.imageFile;

    console.log("imageFile", imageFile, name, birthdate);

    // const imageUrl = await uploadToCloudinary(imageFile);

    // const artist = new Artist({
    //   name,
    //   birthdate,
    //   imageUrl,
    // });

    // await artist.save();

    res.status(201).json("artist");
  } catch (error) {
    console.log("Error in createSong", error);
    next(error);
  }
};
