import { Genre } from "../models/genre.model.js";

export const getAllGenres = async (req, res, next) => {
  try {
    const genres = await Genre.find({}).sort({ name: 1 });
    res.status(200).json(genres);
  } catch (error) {
    console.log("Error in getAllGenres", error);
    next(error);
  }
};
