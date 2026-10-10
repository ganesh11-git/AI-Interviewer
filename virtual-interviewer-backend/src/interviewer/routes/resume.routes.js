import express from "express";
import multer from "multer";
import axios from "axios";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("Resume saved:", filePath);

    const py = await axios.post("http://localhost:8000/resume/extract", {
      file_path: filePath,
    });

    res.json(py.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resume upload failed" });
  }
});

export default router;