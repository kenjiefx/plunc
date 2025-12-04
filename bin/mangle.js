const fs = require("fs");
const path = require("path");
const rootDir = path.resolve(__dirname, "..");

let counter = 0;

function createMinifiedName() {
  let n = counter++;
  let s = "";
  do {
    s = String.fromCharCode(97 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return `x${s}`;
}

function execute() {
  const bundledScript = path.join(rootDir, "dist", "bundle.js");
  if (!fs.existsSync(bundledScript)) {
    console.error(
      "Bundled script not found. Please make sure to execute esbuild first."
    );
    process.exit(1);
  }
  const content = fs.readFileSync(bundledScript, "utf8");
  const registry = new Map();
  const mangleRegex = /\b(__[A-Za-z0-9_]*)\b/g;
  let match;
  while ((match = mangleRegex.exec(content)) !== null) {
    if (!registry.has(match[1])) {
      registry.set(match[1], createMinifiedName());
    }
  }
  registry.forEach((minifiedName, originalName) => {
    console.log(`${originalName} -> ${minifiedName}`);
  });
  let mangledContent = content;
  registry.forEach((minifiedName, originalName) => {
    const safeOriginal = originalName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    mangledContent = mangledContent.replace(
      new RegExp(`\\b${safeOriginal}\\b`, "g"),
      minifiedName
    );
  });
  fs.writeFileSync(bundledScript, mangledContent, "utf8");
  console.log("Mangling complete.");
}

execute();
