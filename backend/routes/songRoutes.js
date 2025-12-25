import express from "express";
import multer from "multer";
import Song from "../models/Song.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
router.get("/", async (req, res) => {
  const songs = await Song.find().sort({ _id: -1 });
  res.json(songs);
});


// BULK UPLOAD
router.post("/bulk-upload", upload.array("songs", 200), async (req, res) => {
  const songsData = req.files.map(file => ({
    title: file.originalname.replace(".mp3",""),
    artist: "Unknown",
    file: file.filename
  }));


  await Song.insertMany(songsData);

  res.json({ message: "100+ songs uploaded successfully" });
});

export default router;
