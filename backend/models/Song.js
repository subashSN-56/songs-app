import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  file: String,
  cover: String,
});

export default mongoose.model("Song", songSchema);
