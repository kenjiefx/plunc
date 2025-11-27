import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Needed because ES modules don't have __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute paths to your browser test files
const browserHtmlPath = path.join(
  __dirname,
  "test/compatability/browser/index.html"
);
const browserJsPath = path.join(
  __dirname,
  "test/compatability/browser/index.js"
);

// Route: serve the HTML file
app.get("/test/browser", (req, res) => {
  res.sendFile(browserHtmlPath);
});

// Route: serve the JS file
app.get("/test/browser/index.js", (req, res) => {
  res.sendFile(browserJsPath);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
