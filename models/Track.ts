import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISong extends Document {
  title: string;
  artist: string;
  genre: string;
  duration: string;
  plays: number;
  downloads: number;
  description: string;
  artworkCredit: string;
  artistBio: string;
  coverImage: string;
  audioSrc: string;
  status: "Published" | "Draft";
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema<ISong>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    duration: { type: String, default: "3:45" },
    plays: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    description: { type: String, default: "" },
    artworkCredit: { type: String, default: "" },
    artistBio: { type: String, default: "" },
    coverImage: { type: String, required: true },
    audioSrc: { type: String, required: true },
    status: { type: String, enum: ["Published", "Draft"], default: "Published" },
  },
  { timestamps: true }
);

export default (mongoose.models.Song as Model<ISong>) || mongoose.model<ISong>("Song", SongSchema);