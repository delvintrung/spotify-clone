import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthdate: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    genres: { type: [String] },
  },
  { timestamps: true }
); //  createdAt, updatedAt

export const Artist = mongoose.model("Artist", artistSchema);
