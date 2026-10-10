const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

router.post("/run-python", (req, res) => {
  try {
    const { code } = req.body;

    if (!code) return res.json({ output: "No code received" });

    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const filePath = path.join(tempDir, "main.py");

    fs.writeFileSync(filePath, code);

    exec(`python "${filePath}"`, (err, stdout, stderr) => {
      if (err) return res.json({ output: stderr || err.message });
      res.json({ output: stdout });
    });

  } catch (err) {
    res.json({ output: err.message });
  }
});

module.exports = router;
