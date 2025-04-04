import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "favorite_songs",
  }
); //  createdAt, updatedAt

export const Favorite = mongoose.model("Favorite", favoriteSchema);
