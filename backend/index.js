import express from "express";
import { exec } from "child_process";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/execute", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  let command;

  if (language === "javascript") {
    // Check if it's pure JavaScript or HTML/JS for the browser
    if (code.includes("<script") || code.includes("<html")) {
      // For HTML/JS that should run in a browser context, return as HTML to be rendered
      return res.json({ output: code }); // Directly return the HTML/JS code to be rendered
    } else {
      // For Node.js-specific JavaScript code
      command = `node -e "${code.replace(/"/g, '\\"')}"`;
    }
  } else if (language === "python") {
    command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
  } else {
    return res.status(400).json({ error: "Unsupported language" });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }
    res.json({ output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
