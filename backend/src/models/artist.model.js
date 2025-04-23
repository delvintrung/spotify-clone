import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthdate: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
    description: {type:String},
    followers: {type:Number},
    listeners: {type:Number}
  },
  { timestamps: true }
); //  createdAt, updatedAt

export const Artist = mongoose.model("Artist", artistSchema);
