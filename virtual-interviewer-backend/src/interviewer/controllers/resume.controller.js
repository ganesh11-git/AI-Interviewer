import axios from "axios";
import fs from "fs";
import path from "path";

export const uploadResume = async (req, res) => {
  try {
    console.log("Resume upload hit");

    const absolutePath = path.resolve(req.file.path);
    console.log("Absolute path:", absolutePath);

    const response = await axios.post(
      "http://127.0.0.1:8000/resume/extract",
      { file_path: absolutePath }
    );

    // ✅ SEND RESPONSE FIRST
    res.status(200).json({ text: response.data.text });

    // 🧹 CLEANUP (non-blocking, safe)
    fs.unlink(absolutePath, (err) => {
      if (err) console.warn("File cleanup failed:", err.message);
    });

  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ error: "Resume upload failed" });
  }
};
