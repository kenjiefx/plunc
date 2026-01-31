import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// ES module replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve entire folders
app.use(
  "/test/browser",
  express.static(path.join(__dirname, "test/compatability/browser")),
);

app.use(
  "/test/integration",
  express.static(path.join(__dirname, "test/integration")),
);

app.use("/test/repeat", express.static(path.join(__dirname, "out/repeat")));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
