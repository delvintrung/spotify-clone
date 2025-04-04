import { Song } from "../models/song.model.js";
import { Artist } from "../models/artist.model.js";
import { Genre } from "../models/genre.model.js";

export const getAllArtist = async (req, res, next) => {
  try {
    // -1 = Descending => newest -> oldest
    // 1 = Ascending => oldest -> newest
    const artists = await Artist.find()
      .populate("genres")
      .sort({ createdAt: -1 });
    res.json(artists);
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
